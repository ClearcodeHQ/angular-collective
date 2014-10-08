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
    frameworks: ['ng-scenario'],

    // list of files / patterns to load in the browser
    files: [
      '../test/e2e/**/*.js',
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
      port: 3000,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'Firefox'
    ],

    // Which plugins to enable
    plugins: [
      'karma-firefox-launcher',
      'karma-ng-scenario',
      'karma-ng-html2js-preprocessor'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

  //  Uncomment the following lines if you are using grunt's server to run the tests
    proxies: {
      '/': 'http://localhost:3000/#!/'
    },
  //  URL root prevent conflicts with the site root
    urlRoot: '_karma_'
  });
};
