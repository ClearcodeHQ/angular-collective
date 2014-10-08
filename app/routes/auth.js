'use strict';

/**
  * Module dependencies
  */

var passport = require('passport');

module.exports = function(app) {
    var users = require('../../app/controllers/users.js');
    app.route('/auth/signin').get(passport.authenticate('github', {scope: 'public_repo'}));
    app.route('/auth/github/callback').get(passport.authenticate('github',  {failureRedirect:'/auth/signin'}),
        function(req, res) {
            res.redirect('/#!');
        });
    app.route('/api/currentuser').get(users.currentUser);
    app.route('/auth/signout').get(users.signout);
    app.route('/auth/token').get(users.getCurrentUserToken);
};
