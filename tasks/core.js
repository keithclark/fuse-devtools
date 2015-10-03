/* jshint node: true, camelcase: false */

'use strict';

module.exports = function(grunt) {

    grunt.config.merge({
        jshint: {
            core: {
                options: {
                    node: true
                },
                src: 'src/core/**/*.js'
            }
        },
        copy: {
            core: {
                expand: true,
                cwd: 'src/core/',
                dest: 'build/core/',
                src: [
                    'core.js'
                ]
            }
        },
        jasmine_node: {
            core: ['tests/core_spec']
        },
        watch: {
            core: {
                options: {
                  interrupt: true,
                },
                files: 'src/core/**/*.js',
                tasks: ['newer:jshint:core', 'jasmine_node:core', 'newer:copy:core']
            }
        }
    });

	grunt.registerTask('core', 'Builds the core', ['jshint:core', 'jasmine_node:core', 'copy:core']);
};
