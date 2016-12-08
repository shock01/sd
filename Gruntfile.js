var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
    'use strict';


    grunt
        .initConfig({
            pkg: grunt.file.readJSON('package.json'),
            concat: {
                dist: {
                    src: ['src/xmlns.js','src/sd.js','src/compile/compile.js', 'src/xinclude/xinclude.js'],
                    dest: '<%= pkg.name %>.js',
                    options: {
                        banner: ";(function(){ \n /** sd angular svg directives */ \n'use strict';",
                        footer: "}());"
                    }
                }
            },
            uglify: {
                options: {
                    mangle: true
                },
                my_target: {
                    files: {
                        '<%= pkg.name %>.min.js': '<%= pkg.name %>.js'
                    }
                }
            },
            connect: {
                server: {
                    options: {
                        hostname: '*',
                        base: '.',
                        keepalive: true
                    }
                }
            },
            jsbeautifier: {
                src: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
                options: {
                    "indent_size": 2,
                    "indent_char": " ",
                    "indent_level": 0,
                    "indent_with_tabs": false,
                    "preserve_newlines": true,
                    "max_preserve_newlines": 10,
                    "jslint_happy": true,
                    "brace_style": "collapse",
                    "keep_array_indentation": false,
                    "keep_function_indentation": false,
                    "space_before_conditional": true,
                    "eval_code": false,
                    "indent_case": false,
                    "unescape_strings": false
                }
            },
            jshint: {
                dev: {
                    options: {
                        jshintrc: '.jshintrc',
                        force: true,
                    },
                    src: ['src/**/*.js', 'test/**/*.js']
                }
            },
        });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('build', ['concat','uglify']);
    grunt.registerTask('default', ['build']);


};
