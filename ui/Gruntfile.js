'use strict';

var modRewrite = require('connect-modrewrite');

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

    var proxyRequest = require('grunt-connect-proxy/lib/utils').proxyRequest,
        resolvePath = require('path').resolve;

    function mountFolder(connect, dir) {
        return connect.static(resolvePath(dir));
    }

    // get build config from bower
    // default values could be merged with an 'extend' function, but requiring underscore or a similar library just for
    // that seems too heavyweight
    var buildConfig = require('./bower.json').buildConfig || {};
    buildConfig.layout = buildConfig.layout || {};
    buildConfig.layout.app = buildConfig.layout.app || 'app';
    buildConfig.layout.dist = buildConfig.layout.dist || 'dist';

    // Define the configuration for all the tasks
  grunt.initConfig({
      layout: buildConfig.layout,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= layout.app %>/scripts/{,*/}*.js'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      sass: {
        files: ['<%= layout.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= layout.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= layout.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729,
        base: [
          '.tmp',
          '<%= layout.app %>'
        ],
        middleware: function (connect, options, middlewares) {
          return middlewares;
        }
      },
      server: {
        options: {
          port: 9000,
          hostname: 'localhost'
        },
        proxies: [{
          context: '/api',
          host: 'localhost',
          port: 8080,
          https: false,
          changeOrigin: false,
          xforward: false
        }]
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= layout.app %>'
          ],
          middleware: function (connect, options) {
            var middlewares = [
              proxyRequest
            ];

            // Matches everything that does not contain a '.' (period)
            middlewares.push(modRewrite([
              '^[^\\.]*$ /index.html [L]'
            ]));
            options.base.forEach(function (base) {
              middlewares.push(connect.static(base));
            });

            middlewares.push(
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              )
            );

            return middlewares;
          }
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= layout.app %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= layout.dist %>/*',
            '!<%= layout.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    'bower-install': {
      app: {
        html: '<%= layout.app %>/index.html',
        ignorePath: '<%= layout.app %>/'
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        sourceMap: true,
        includePaths: [
          '<%= layout.app %>/bower_components'
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= layout.app %>/styles',
          src: ['*.{scss,sass}'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= layout.dist %>/scripts/{,*/}*.js',
            '<%= layout.dist %>/styles/{,*/}*.css',
            '<%= layout.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= layout.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= layout.app %>/index.html',
      options: {
        dest: '<%= layout.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= layout.dist %>/{,*/}*.html'],
      css: ['<%= layout.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= layout.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= layout.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= layout.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= layout.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= layout.dist %>/images'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= layout.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= layout.dist %>'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= layout.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= layout.app %>',
          dest: '<%= layout.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'bower_components/**/*',
            'images/{,*/}*.{webp}',
            'fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= layout.dist %>/images',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= layout.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      dist: [
        'sass:dist',
        'imagemin',
        'svgmin'
      ]
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= layout.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= layout.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= layout.dist %>/scripts/scripts.js': [
    //         '<%= layout.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });


  grunt.registerTask('serve', function (target) {
    // if (target === 'dist') {
    //   return grunt.task.run(['build', 'connect:dist:keepalive']);
    // }

    grunt.task.run([
      'clean:server',
      'bower-install',
      'autoprefixer',
      'sass',
      'configureProxies:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', [
    'clean:server',
    'autoprefixer',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'bower-install',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
