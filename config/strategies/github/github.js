'use strict';

/**
* Module dependencies.
*/
var passport = require('passport'),
  url = require('url'),
  config = require('../../config'),

  GitHubStrategy = require('passport-github').Strategy;

module.exports = function() {
  // Use github strategy
  passport.use(new GitHubStrategy({
      clientID: config.github.clientID,
      clientSecret: config.github.clientSecret,
      callbackURL: config.github.callbackURL,
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
      req.session.gitToken = accessToken;
      process.nextTick(function () {
        return done(null, profile);
      });
    }
  ));
};
