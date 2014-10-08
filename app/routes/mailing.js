'use strict';

/**
  * Module dependencies
  */

module.exports = function(app) {
    var mailing = require('../../app/controllers/mailing.js');
    app.route('/api/newsletterAdd').get(mailing.addToSubscribersList);
    app.route('/api/newsletterDelete').get(mailing.removeFromSubscribersList);
    app.route('/api/mailBadass').get(mailing.forceMail);
};
