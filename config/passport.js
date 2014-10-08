'use strict';

var passport = require('passport'),
  path = require('path'),
  config = require('./config');

module.exports = function() {
  // Serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  // Deserialize sessions
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  // Initialize strategies
  config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function(strategy) {
    require(path.resolve(strategy))();
  });
};
