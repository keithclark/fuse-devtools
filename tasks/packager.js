/* jshint node: true */

'use strict';

module.exports = function(grunt) {
    var exec = require('child_process').exec,
        fs = require('fs'),
        path = require('path'),
        archiver = require('archiver');


    /**
     * Check the directory of the passed filepath exists and create it if
     * it doesn't
     */
    function ensureDirExists(filepath) {
        var dir = path.dirname(filepath);
        if (!grunt.file.isDir(dir)) {
            grunt.file.mkdir(dir);
            return true;
        }
    }


    /**
     * Fully qualify the given path. This resolves problems with file locations
     * on different OS'.
     */
    function qualifyPath(filepath) {
        return path.resolve(process.cwd(), filepath);
    }


    /**
     * Packages the passed directory of files in to a zip archive and 
     * writes it to disk
     */
    function packageZip(srcPath, destPath, done) {
        var output = fs.createWriteStream(destPath),
            archive = archiver('zip');

        output.on('close', function () {
            grunt.log.ok('Saved package: ' + destPath);
            done();
        });

        archive.on('error', function (err) {
            grunt.log.error(err);
            done(false);
        });

        // ensure the dest directory exists
        ensureDirExists(destPath);

        archive.pipe(output);

        archive.bulk([{
            expand: true,
            cwd: srcPath,
            src: ['**/*']
        }]);

        archive.finalize();
    }


    /**
     * Packages an extension via the browser CLI. This method is used by
     * Chrome and Opera.
     */
    function packageChrome(binPath, srcPath, destPath, keyPath, done) {
        var cmd, destExt;

        // Check the source files exist
        if (!grunt.file.exists(srcPath)) {
            grunt.log.error('Source files not found');
            return done(false);
        }

        // Check the application exists
        if (!binPath || !grunt.file.exists(binPath)) {
            grunt.log.error('Application binary not found');
            return done(false);
        }

        // get the dest extension
        destExt = path.extname(destPath);

        // build the command
        cmd = '"' + binPath + '" --pack-extension="' + srcPath + '"';
 
        // If a private key file exists, use it
        if (keyPath && grunt.file.exists(keyPath)) {
            grunt.log.ok('Private key file found.');
            cmd += ' --pack-extension-key="' + keyPath + '"';
        } else {
            grunt.log.warn('No private key file found. A new one will be created.');
        }

        // execute the command and copy packaged files to final location. Note
        // the timeout is used to kill any hanging processes (Opera waits for
        // user input before closing on Windows and hangs on OSX if an existing
        // private key is passed)
        exec(cmd, {timeout: 5000}, function (err) {
            // `err` is unreliable here. A successful build can still return
            // an error (Opera does this when you close the package CLI on a
            // Windows machine). The only way to really know if the process
            // worked correctly is to see if the output file was generated.
            if (!grunt.file.exists(srcPath + destExt)) {
                grunt.log.error(err);
                done(false);
                return false;
            }

            // ensure the dest directory exists
            ensureDirExists(destPath);

            // move the package into the dest directoy
            fs.renameSync(srcPath + destExt, destPath);

            // if a private key file was created, move that too
            if (grunt.file.exists(srcPath + '.pem')) {
                fs.renameSync(srcPath + '.pem', keyPath);
                grunt.log.ok('Saved private key file: ' + keyPath);
            }
            grunt.log.ok('Saved package: ' + destPath);

            done();
        });
    }

    /**
     * Register the `package` task
     */
    grunt.registerMultiTask('package', 'Package extensions for installation', function () {
        var done = this.async();

        if (this.data.method === 'chrome') {
            packageChrome(
                grunt.file.expand(this.data.bin)[0],
                qualifyPath(this.data.src),
                qualifyPath(this.data.dest),
                qualifyPath(this.data.privateKeyFile),
                done
            );
        } else if (this.data.method === 'zip') {
            packageZip(
                qualifyPath(this.data.src),
                qualifyPath(this.data.dest),
                done
            );
        }
    });
};
