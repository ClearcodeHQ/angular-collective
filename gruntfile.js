// Generated on 2014-07-14 using generator-angular 0.9.2
'use strict';

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

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'public',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({
    jasmine_node: {
      options: {
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec',
        jUnit: {
          report: false,
          savePath : './build/reports/jasmine/',
          useDotNotation: true,
          consolidate: true
        }
      },
      all: ['test/backend']
    },

      notify_hooks: {
        options: {
          enabled: true,
      title: 'Angular Collective' // defaults to the name in package.json, or will use project directory's name
    }
  },

    notify: {
      task_name: {
        options: {
          // Task-specific options go here.
        }
      },
      watch: {
        options: {
          title: 'Task Complete',  // optional
          message: 'SASS and Uglify finished running', //required
        }
      },
      server: {
        options: {
          message: 'Server is ready!'
        }
      }
    },
    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
      files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
      tasks: ['newer:jshint:all'],
      options: {
        livereload: '<%= connect.options.livereload %>'
      }
    },
    jsTest: {
    files: ['test/spec/{,*/}*.js'],
    tasks: ['newer:jshint:test', 'karma']
  },
  compass: {
  files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
  tasks: ['compass:server', 'autoprefixer']
},
gruntfile: {
  files: ['Gruntfile.js']
},
// livereload: {
//   options: {
//     livereload: '<%= connect.options.livereload %>'
//   },
//   files: [
//     '<%= yeoman.app %>/{,*/}*.html',
//     '.tmp/styles/{,*/}*.css',
//     '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
//   ]
// }
},

// The actual grunt server settings
connect: {
  options: {
    port: 3000,
    // Change this to '0.0.0.0' to access the server from outside.
    hostname: 'localhost',
    livereload: 35729
  },
  livereload: {
    options: {
      open: true,
      middleware: function (connect) {
        return [
        connect.static('.tmp'),
        connect().use(
          '/bower_components',
          connect.static('./bower_components')
        ),
        connect.static(appConfig.app)
        ];
      }
    }
  },
  test: {
    options: {
      port: 9001,
      middleware: function (connect) {
        return [
        connect.static('.tmp'),
        connect.static('test'),
        connect().use(
          '/bower_components',
          connect.static('./bower_components')
        ),
        connect.static(appConfig.app)
        ];
      }
    }
  },
  dist: {
    options: {
      open: true,
      base: '<%= yeoman.dist %>'
    }
  }
},

// Make sure code styles are up to par and there are no obvious mistakes
jshint: {
  options: {
    jshintrc: '.jshintrc',
    reporter: require('jshint-stylish')
  },
  all: {
    src: [
    'Gruntfile.js',
  '<%= yeoman.app %>/scripts/{,*/}*.js'
  ]
},
backend:{
  src:[
  'app/**/*.js'
  ]
},
test: {
  options: {
    jshintrc: 'test/.jshintrc'
  },
src: ['test/spec/{,*/}*.js']
}
},

jscs: {
  all: {
     options: {
        config: '.jscsrc',
    }
  },
  frontend: {
    src:'<%= yeoman.app %>/scripts/{,*/}*.js'
  },
  backend: {
    src:'app/**/*.js'
  }
},

// Empties folders to start fresh
clean: {
  dist: {
    files: [{
      dot: true,
      src: [
      '<%= yeoman.dist %>/.tmp',
    '<%= yeoman.dist %>/{,*/}*',
    '!<%= yeoman.dist %>/.git*'
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
      cwd: '<%= yeoman.dist %>/.tmp/styles/',
    src: '{,*/}*.css',
    dest: '<%= yeoman.dist %>/.tmp/styles/'
  }]
}
},

// Automatically inject Bower components into the app
wiredep: {
  options: {
    cwd: '<%= yeoman.app %>'
  },
  app: {
    src: ['<%= yeoman.app %>/index.html'],
    ignorePath:  /\.\.\//,
    exclude: ['<%= yeoman.app %>/lib/bootstrap-sass-official/vendor/assets/javascripts/bootstrap']
  },
  sass: {
  src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
  ignorePath: '<%= yeoman.app %>/lib'
},

},

// Compiles Sass to CSS and generates necessary files if requested
compass: {
  options: {
    sassDir: '<%= yeoman.app %>/styles',
    cssDir: '<%= yeoman.app %>/.tmp/styles',
    generatedImagesDir: '<%= yeoman.app %>/.tmp/images/generated',
    imagesDir: '<%= yeoman.app %>/images',
    javascriptsDir: '<%= yeoman.app %>/scripts',
    fontsDir: '<%= yeoman.app %>/styles/fonts',
    importPath: '<%= yeoman.app %>/lib',
    httpImagesPath: '/images',
    httpGeneratedImagesPath: '/images/generated',
    httpFontsPath: '/styles/fonts',
    relativeAssets: false,
    assetCacheBuster: false,
    raw: 'Sass::Script::Number.precision = 10\n'
  },
  dist: {
    options: {
      generatedImagesDir: '<%= yeoman.dist %>/images/generated'
    }
  },
  server: {
    options: {
      debugInfo: true
    }
  }
},

// Renames files for browser caching purposes
filerev: {
  dist: {
    src: [
  '<%= yeoman.dist %>/scripts/{,*/}*.js',
'<%= yeoman.dist %>/styles/{,*/}*.css',
'<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
'<%= yeoman.dist %>/styles/fonts/*'
]
}
},

// Reads HTML for usemin blocks to enable smart builds that automatically
// concat, minify and revision files. Creates configurations in memory so
// additional tasks can operate on them
useminPrepare: {
  html: '<%= yeoman.app %>/index.html',
  options: {
    dest: '<%= yeoman.dist %>',
    flow: {
      html: {
        steps: {
          js: ['concat', 'uglifyjs'],
          css: ['cssmin']
        },
        post: {}
      }
    }
  }
},

// Performs rewrites based on filerev and the useminPrepare configuration
usemin: {
html: ['<%= yeoman.dist %>/{,*/}*.html'],
css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
options: {
  assetsDirs: ['<%= yeoman.dist %>','<%= yeoman.dist %>/images']
}
},

imagemin: {
  dist: {
    files: [{
      expand: true,
      cwd: '<%= yeoman.app %>/images',
    src: '{,*/}*.{png,jpg,jpeg,gif}',
    dest: '<%= yeoman.dist %>/images'
  }]
}
},

svgmin: {
  dist: {
    files: [{
      expand: true,
      cwd: '<%= yeoman.app %>/images',
    src: '{,*/}*.svg',
    dest: '<%= yeoman.dist %>/images'
  }]
}
},

htmlmin: {
  dist: {
    options: {
      collapseWhitespace: true,
      conservativeCollapse: true,
      collapseBooleanAttributes: true,
      removeCommentsFromCDATA: true,
      removeOptionalTags: true
    },
    files: [{
      expand: true,
      cwd: '<%= yeoman.dist %>',
    src: ['*.html', 'views/{,*/}*.html'],
    dest: '<%= yeoman.dist %>'
  }]
}
},

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


cdnify: {
  dist: {
    html: ['<%= yeoman.dist %>/*.html']
  }
},

targethtml: {
  dist_tmp: {
    files: {
      '<%= yeoman.dist_tmp %>/index.html': '<%= yeoman.dist_tmp %>/index.html'
    }
  }
},
nodemon: {
  all: {
    script: 'server.js',
    options: {
      ignore: ["node_modules/**"],
      nodeArgs: ['--debug'],
      ext: 'js,html'
    }
  }
},
'node-inspector': {
  custom: {
    options: {
      'web-port': 1337,
      'web-host': 'localhost',
      'debug-port': 9020,
      'save-live-edit': true,
      'no-preload': true,
      'stack-trace-limit': 50,
      'hidden': []
    }
  }
},
// Copies remaining files to places other tasks can use
copy: {
  dist: {
    files: [{
      expand: true,
      dot: true,
      cwd: '<%= yeoman.app %>',
      dest: '<%= yeoman.dist %>',
      src: [
      '*.{ico,png,txt}',
      '.htaccess',
      '*.html',
    'views/{,*/}*.html',
  'images/{,*/}*.{webp}',
  'fonts/*'
  ]
}, {
  expand: true,
  cwd: '.tmp/images',
  dest: '<%= yeoman.dist %>/images',
  src: ['generated/*']
}, {
  expand: true,
  cwd: '.',
  src: 'bower_components/bootstrap-sass-official/vendor/assets/fonts/bootstrap/*',
  dest: '<%= yeoman.dist %>'
}]
},
styles: {
  expand: true,
  cwd: '<%= yeoman.app %>/styles',
  dest: '<%= yeoman.app %>/.tmp/styles/',
  src: '{,*/}*.css'
}
},

// Run some tasks in parallel to speed up the build process
concurrent: {
  server: [
  'nodemon:dev',
  'notify:watch'
  ],
  test: [
  'compass'
  ],
  dist: [
  'compass:dist',
  'imagemin',
  'svgmin'
  ]
},

shell: {
  runMongo: {
    command: 'mongod',
    options: {
      async: true
    }
  },
  runSelenium: {
    command: 'webdriver-manager start',
    options: {
      async: true
    }
  },
  runProtractor: {
    command: 'protractor protractor_conf.js',
    options: {
      async: false
    }
  }
},

// Test settings
karma: {
  unit: {
    configFile: 'test/karma.conf.js',
    singleRun: true
  },
  e2e: {
    configFile: 'test/karma-e2e.conf.js'
  },
  serverUnit: {
    configFile:'test/karma-server.conf.js'
  }
}
});

grunt.loadNpmTasks('grunt-notify');
grunt.loadNpmTasks('grunt-targethtml');
grunt.loadNpmTasks('grunt-shell-spawn');
grunt.loadNpmTasks('grunt-jasmine-node');
grunt.loadNpmTasks('grunt-jscs');
grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
  if (target === 'dist') {
    return grunt.task.run(['build', 'connect:dist:keepalive']);
  }

  grunt.task.run([
    'clean:server',
    'compass',
    'wiredep',
    'notify:server',
    'autoprefixer',
    'nodemon',
    'watch',
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('testbackend',[
  'jasmine_node'
  ]);
  grunt.registerTask('test', [
  'clean:server',
  'concurrent:test',
  'autoprefixer',
  'connect:test',
  'karma'
  ]);

  grunt.registerTask('e2eTest', [
  'clean:server',
  'concurrent:test',
  'autoprefixer',
  'shell:runSelenium',
  'shell:runProtractor'

  ]);

  grunt.registerTask('kille2eTest', [
  'shell:runSelenium:kill',
  'shell:runProtractor:kill'

  ]);

  grunt.registerTask('build', [
  'clean:dist',
  'wiredep',
  'useminPrepare',
  'concurrent:dist',
  'autoprefixer',
  'concat',
  'ngmin',
  'copy:dist',
  'cdnify',
  'cssmin',
  'uglify',
  'filerev',
  'usemin',
  'htmlmin',
  'targethtml:dist'
  ]);

  grunt.registerTask('default', [
  'newer:jshint',
  'test',
  'build'
  ]);


  grunt.task.run('notify_hooks');
};
