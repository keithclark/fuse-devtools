'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                strict: true,
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                camelcase: true,
                indent: 4,
                quotmark: 'single',
                undef: true,
                white: true,
                unused: true
            },
            grunt: {
                options: {
                    node: true
                },
                src: [
                    'tasks/**/*.js',
                    'gruntfile.js'
                ]
            },
            tests: {
                options: {
                    node: true,
                    jasmine: true
                },
                src: 'tests/**/*_spec.js'
            }
        },
        copy: {
            options: {
                noProcess: '**/*.{png,gif,jpg,ico}'
            }
        },
        watch: {
            grunt: {
                files: [
                    'tests/**/*.js',
                    'tasks/**/*.js',
                    'gruntfile.js'
                ],
                tasks: ['newer:jshint:grunt']
            },
            tests: {
                files: 'tests/**/*_spec.js',
                tasks: 'jasmine_node'
            }
        }

    });

    // Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-newer');

    // Load extension build tasks
    grunt.loadTasks('tasks');

    // Register the default task
    grunt.registerTask('build', 'Lint, test and build everything', ['jshint:grunt', 'jshint:tests', 'core', 'chrome', 'firefox', 'opera']);

    // Register alais tasks so tooling can be switched
    grunt.registerTask('test', 'Run all unit tests', 'jasmine_node');
    grunt.registerTask('lint', 'Lint all project files', 'jshint');

};
