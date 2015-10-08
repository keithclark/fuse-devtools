/* jshint node: true */

'use strict';

module.exports = function(grunt) {

    grunt.config.merge({
        browser: {
            firefox: grunt.file.readJSON('./config/firefox.json')
        },
        jshint: {
            firefox: {
                options: {
                    strict: false,
                    esnext: true,
                    moz: true,
                    globals: {
                        XPCOMUtils: true,
                        Components: true,
                        Services: true,
                        gDevTools: true
                    }
                },
                src: 'src/firefox/**/*.js'
            }
        },
        copy: {
            firefox: {
                options: {
                    process: function(content, path) {
                        if (path === 'src/firefox/chrome.manifest') {
                            content += grunt.file.expand({cwd:'lang/'}, '*.json').map(function (src) {
                                var code = src.slice(0, -5);
                                return 'locale  <%= pkg.name %> ' + code + ' locale/' + code + '/';
                            }).join('\n');
                        } else if (path.substring(0, 5) === 'lang/') {
                            var props = JSON.parse(content);
                            content = Object.keys(props).map(function (key) {
                                return key + '=' + props[key];
                            }).join('\n');
                        }
                        return grunt.config.process(content);
                    }
                },
                files: [
                    {expand: true, cwd: 'build/core/', src: '*', dest: 'build/firefox/chrome/js'},
                    {expand: true, cwd: 'src/firefox/', src: '**', dest: 'build/firefox'},
                    {expand: true, cwd: 'assets/img/', src: '*', dest: 'build/firefox/skin/img/'},
                    {expand: true, cwd: 'lang/', src: '*', dest: 'build/firefox/locale/', rename: function(src, dest) {
                        return src + dest.slice(0, -5) + '/strings.properties';
                    }}
                ]
            }
        },
        watch: {
            firefox: {
                files: [
                    'build/core/*',
                    'src/firefox/**/*',
                    '!src/firefox/**/*.js',
                    'assets/img/*',
                    'lang/*.json'
                ],
                tasks: ['newer:copy:firefox']
            },
            firefoxJS: {
                files: ['src/firefox/**/*.js'],
                tasks: ['newer:jshint:firefox', 'newer:copy:firefox']
            }
        },
        package: {
            firefox: {
                method: 'zip',
                src: 'build/firefox',
                dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.xpi'
            }
        }
    });

    grunt.registerTask('firefox', 'Builds the Firefox extension', function() {
        this.requires('core');
        grunt.task.run(['jshint:firefox', 'copy:firefox']);
    });

};
