'use strict';

/**
  * Module dependencies
  */

module.exports = function(app) {
    var repos = require('../../app/controllers/repositories.js');
    app.route('/api/users/clearcodeangularjs/repos').get(repos.getAllRepositories);
    app.route('/api/repos/:user/:repository/readme').get(repos.getReadmeForRepo);
    app.route('/api/search/repositories').get(repos.searchRepositories);
    app.route('/api/repos/:user/:repository/bower.json').get(repos.getBowerJsonForRepo);
    app.route('/api/facets/all').get(repos.getFacets);
    app.route('/api/facets/value').get(repos.getValuesforFacet);
    app.route('/api/tags').get(repos.getAllTags);
    app.route('/api/addVote').get(repos.addVote);
    app.route('/api/repo/update').post(repos.updateRepo);
};
