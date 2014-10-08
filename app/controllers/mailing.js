'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    Repository = mongoose.model('Repository'),
    getNewestRepositories,
    generateNewsMail,
    generateHTMLAndSend,
    fs = require('fs'),
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    api_key = 'key-b37fa9b2572d5f433457e0ba6b2a223d',
     // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
    domain = 'sandbox93156b6b606a4146b88ffbe0abe8481d.mailgun.org',
    CronJob = require('cron').CronJob,
    Mailgun = require('mailgun-js'),
     // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    mailgun = new Mailgun({apiKey: api_key, domain: domain}),
    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
    list = mailgun.lists('newsletter@sandbox93156b6b606a4146b88ffbe0abe8481d.mailgun.org'),
    data = {
        from: 'Angular Collective Newsletter <angcolNews@mailgun.org>',
        to: 'newsletter@sandbox93156b6b606a4146b88ffbe0abe8481d.mailgun.org',
        subject: 'Newsletter - ' + new Date().toLocaleDateString()
    },
    job,
    q = require('q'),
    deferred = q.defer();

generateNewsMail = function() {
    var date = new Date();
    date = date.setDate(date.getDate() - 7);
    Repository.find({createdAt:{$gte: date}}, {}, function(err, data) {
        deferred.resolve(data);
    });
    return deferred.promise;
};

generateHTMLAndSend = function(repositories) {
    var jsdom = require('jsdom'),
    resp = fs.readFileSync(process.cwd() + '/app/mocks/mail.html', {encoding:'utf8'});
    jsdom.env(
        resp,
        function(errors, window) {
            var $ = require('jquery')(window),
            i,
            repo;
            $('#newCount').text(repositories.length);
            for(i = 0, length = repositories.length; (i < length && i <= 5); i++) {
                repo = '<tr><td style="color: #153643; font-family: Arial, sans-serif;' +
                        'font-size: 18px; padding:30px 0 0 0; width:auto;">' +
                        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                        '<a href="' + repositories[i].html_url + '">' + repositories[i].name +
                        // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
                        '</a> </td> - <td style="color: #153643; font-family: Arial, sans-serif;' +
                        ' font-size: 18px; padding:30px 0 0 0; width:auto;">' +
                        repositories[i].description + '<td></tr>'
                $('#moduleList').append(repo);
            }
            data.html = $('html')[0].outerHTML;
            mailgun.messages().send(data, function(error, body) {
                console.log(error, body);
            });
        }
    );
};

exports.addToSubscribersList = function(req, res) {
    var user = {
        subscribed: true,
        address: req.query.mail
    };

    list.members().create(user)
        .then(function(data) {
            res.json(data)
        }, function(err) {
            res.json(err)
        });
};

exports.removeFromSubscribersList = function(req, res) {
    list.members(req.query.mail).delete()
        .then(function(data) {
            res.json(data)
        }, function(err) {
            res.json(err)
        });
};

job = function() {
    generateNewsMail()
        .then(function(repos) {
            generateHTMLAndSend(repos);
        });
};

//send email every monday on 10:00 am
new CronJob('0 0 10 * * 1', job , null, true);

exports.forceMail = function(req, res) {
    job();
};
