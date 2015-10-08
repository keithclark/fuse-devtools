/* jshint node: true */

'use strict';

module.exports = function(grunt) {

    grunt.config.merge({
        jshint: {
            chrome: {
                options: {
                    globals: {
                        CoreAPI: true,
                        chrome: true
                    }
                },
                src: 'src/chromium/**/*.js'
            }
        },
        copy: {
            chrome: {
                options: {
                    process: function(content, path) {
                        if (path.substring(0, 5) === 'lang/') {
                            var props = JSON.parse(content);
                            Object.keys(props).forEach(function (key) {
                                props[key] = { message: props[key] };
                            });
                            content = JSON.stringify(props, null, 2);
                        }
                        return grunt.config.process(content);
                    }
                },
                files: [
                    {expand: true, cwd: 'build/core/', src: '*.js', dest: 'build/chrome/js'},
                    {expand: true, cwd: 'src/chromium/', src: '**', dest: 'build/chrome'},
                    {expand: true, cwd: 'assets/img/', src: '*', dest: 'build/chrome/img/'},
                    {expand: true, cwd: 'lang/', src: '*', dest: 'build/chrome/_locales/', rename: function(src, dest) {
                        return src + dest.slice(0, -5) + '/messages.json';
                    }}
                ]
            }
        },
        watch: {
            chrome: {
                files: [
                    'build/core/*',
                    'src/chromium/**/*',
                    '!src/chromium/**/*.js',
                    'assets/img/*',
                    'lang/*.json'
                ],
                tasks: ['newer:copy:chrome']
            },
            chromeJS: {
                files: 'src/chromium/**/*.js',
                tasks: ['newer:jshint:chrome', 'newer:copy:chrome']
            }
        },
        package: {
            chrome: {
                method: 'chrome',
                src: 'build/chrome',
                dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.crx',
                bin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                privateKeyFile: 'config/chrome.pem'
            }
        }
    });

    grunt.registerTask('chrome', 'Builds the Chrome extension', function() {
        this.requires('core');
        grunt.task.run(['jshint:chrome', 'copy:chrome']);
    });

};
