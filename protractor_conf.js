// An example configuration file.
var ScreenShotReporter = require('protractor-screenshot-reporter');
exports.config = {
  // Do not start a Selenium Standalone sever - only run this using chrome.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Capabilities to be passed to the webdriver instance.
  multiCapabilities: [{
    'browserName': 'firefox'
  }],

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['test/e2e/scenarios.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },

     onPrepare: function() {
      // Add a screenshot reporter and store screenshots to `/tmp/screnshots`:
      jasmine.getEnv().addReporter(new ScreenShotReporter({
         baseDirectory: '/tmp/screenshots'
      }));
   }

};
