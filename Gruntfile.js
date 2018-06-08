"use strict";

let sprintf = require('sprintf-js').sprintf;

module.exports = function (grunt) {
    let date = (() => {
        let now = new Date();
        return sprintf('%04d-%02d-%02d-%02d%02d', now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes());
    })();

    grunt.initConfig({
        browserify: {
            dist: {
                files: [{
                    cwd: 'es6',
                    dest: 'js',
                    expand: true,
                    ext: '.js',
                    src: ['app.js']
                }],
                options: {
                    browserifyOptions: {
                        debug: true,
                        paths: []
                    }
                }
            }
        },

        processhtml: {
            build: {
                files: {
                    'app.html': ['index.html']
                }
            },
            options: {

            }
        },

        watch: {
            scripts: {
                files: ['es6/**/*.js', 'index.html'],
                tasks: ['browserify', 'processhtml']
            },
        },

        zip: {
            dist: {
                dest: `dist/all-${date}.zip`,
                src: [
                    'index.html',
                    'css/**',
                    'js/**'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-zip');

    grunt.registerTask('default', [
        'browserify', 'processhtml'
    ]);
};

// butler push all-2018-03-11-1134.zip pine-cone/crazy-maze:dev