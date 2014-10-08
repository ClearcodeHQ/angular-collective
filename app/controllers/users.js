'use strict';

exports.signout = function(req, res) {
    req.logout();
    req.session.gitToken = '';
    res.redirect('/');
};

exports.currentUser = function(req, res) {
    res.json(req.user);
};

exports.getCurrentUserToken = function(req, res) {
    res.write(req.session.gitToken);
    res.end();
};
