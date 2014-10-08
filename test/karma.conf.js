// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-07-14 using
// generator-karma 0.8.3

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../public',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    preprocessors: {
      'templates/**/*.html': 'ng-html2js'
    },

    // list of files / patterns to load in the browser
    files: [
      'lib/jquery/dist/jquery.js',
      'lib/angular/angular.js',
      'lib/marked/lib/marked.js',
      'lib/angular-marked/angular-marked.js',
      'lib/angular-disqus/angular-disqus.js',
      'lib/angular-mocks/angular-mocks.js',
      'lib/angular-animate/angular-animate.js',
      'lib/angular-cookies/angular-cookies.js',
      'lib/angular-resource/angular-resource.js',
      'lib/angular-route/angular-route.js',
      'lib/angular-sanitize/angular-sanitize.js',
      'lib/angular-touch/angular-touch.js',
      'lib/angular-bootstrap/ui-bootstrap-tpls.js',
      'lib/angucomplete-alt/angucomplete-alt.js',
      'lib/ui-autocomplete/autocomplete.js',
      'lib/jquery-ui/jquery-ui.js',
      'scripts/**/*.js',
      'templates/**/*.html',
      '../test/mock/**/*.js',
      '../test/spec/**/*.js'
    ],

      // ngHtml2JsPreprocessor: {
      //   // If your build process changes the path to your templates,
      //   // use stripPrefix and prependPrefix to adjust it.
      // //  stripPrefix: 'source/path/to/templates/.*/',
      // //  prependPrefix: 'web/path/to/templates/',
      //
      //   // the name of the Angular module to create
      //   moduleName: 'my.templates'
      // },
    // list of files / patterns to exclude
      exclude: ['scripts/e2e-mocks.js'],

    // web server port
      port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
