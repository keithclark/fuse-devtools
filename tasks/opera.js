/* jshint node: true */

'use strict';

module.exports = function(grunt) {

    grunt.config.merge({
        jshint: {
            opera: {
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
            opera: {
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
                    {expand: true, cwd: 'build/core/', src: '*.js', dest: 'build/opera/js'},
                    {expand: true, cwd: 'src/chromium/', src: '**', dest: 'build/opera'},
                    {expand: true, cwd: 'assets/img/', src: '*', dest: 'build/opera/img/'},
                    {expand: true, cwd: 'lang/', src: '*', dest: 'build/opera/_locales/', rename: function(src, dest) {
                        return src + dest.slice(0, -5) + '/messages.json';
                    }}
                ]
            }
        },
        watch: {
            opera: {
                files: [
                    'build/core/*',
                    'src/chromium/**/*',
                    '!src/chromium/**/*.js',
                    'assets/img/*',
                    'lang/*.json'
                ],
                tasks: ['newer:copy:opera']
            },
            operaJS: {
                files: 'src/chromium/**/*.js',
                tasks: ['newer:jshint:opera', 'newer:copy:opera']
            }
        }
    });

    grunt.registerTask('opera', 'Builds the opera extension', function() {
        this.requires('core');
        grunt.task.run(['jshint:opera', 'copy:opera']);
    });
 
};
