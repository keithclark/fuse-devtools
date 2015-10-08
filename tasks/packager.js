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
     * Packages the passed directory of files in to a zip archive and 
     * writes it to disk
     */
    function packageZip(src, dest, done) {
        var output = fs.createWriteStream(dest),
            archive = archiver('zip');

        output.on('close', function () {
            grunt.log.ok('Saved package: ' + dest);
            done();
        });

        archive.on('error', function (err) {
            grunt.log.error(err);
            done(false);
        });

        archive.pipe(output);

        archive.bulk([{
            expand: true,
            cwd: src,
            src: ['**/*']
        }]);

        archive.finalize();
    }


    /**
     * Packages an extension via the browser CLI. This method is used by
     * Chrome and Opera.
     */
    function packageChrome(data, done) {
        var cmd, destExt;

        // Check the source files exist
        if (!grunt.file.exists(data.src)) {
            grunt.log.error('Source files not found');
            return done(false);
        }

        // Check the application exists
        if (!grunt.file.exists(data.bin)) {
            grunt.log.error('Application binary not found');
            return done(false);
        }

        // get the dest extension
        destExt = path.extname(data.dest);

        // build the command
        cmd = data.bin.replace(/ /g, '\\ ') + ' --pack-extension=' + data.src;
 
        // If a private key file exists, use it
        if (data.privateKeyFile && grunt.file.exists(data.privateKeyFile)) {
            grunt.log.ok('Private key file found.');
            cmd += ' --pack-extension-key=' + data.privateKeyFile;
        } else {
            grunt.log.warn('No private key file found. A new one will be created.');
        }

        // execute the command and copy packaged files to final location
        exec(cmd, {}, function (err) {
            if (err) {
                grunt.log.error(err);
            } else {
                // ensure the dest directory exists
                ensureDirExists(data.dest);

                // move the package into the dest directoy
                fs.renameSync(data.src + destExt, data.dest);

                // if a private key file was created, move that too
                if (grunt.file.exists(data.src + '.pem')) {
                    fs.renameSync(data.src + '.pem', data.privateKeyFile);
                    grunt.log.ok('Saved private key file: ' + data.privateKeyFile);
                }
                grunt.log.ok('Saved package: ' + data.dest);
            }
            done(!err);
        });
    }


    /**
     * Register the `package` task
     */
    grunt.registerMultiTask('package', 'Package extensions for installation', function () {
        var done = this.async();
        if (this.data.method === 'chrome') {
            packageChrome(this.data, done);
        } else if (this.data.method === 'zip') {
            packageZip(this.data.src, this.data.dest, done);
        }
    });
};
