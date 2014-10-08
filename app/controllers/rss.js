'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    Repository = mongoose.model('Repository'),
    config = require('../../config/config'),
    getDailyRepositories,
    generateRSSFeed,
    CronJob = require('cron').CronJob,
    RSS = require('rss'),
    fs = require('fs'),
    feed = new RSS({
        title: 'Angular Colective',
        description: 'Daily dose of new Angular modules!',
         // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        feed_url: config.url + '/rss.xml',
         // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
        managingEditor: 'ClearCode',
        webMaster: 'ClearCode',
        copyright: '2014 ClearCode',
        language: 'en',
        pubDate: 'May 20, 2012 04:00:00 GMT',
        ttl: '60'
    }),
    job,
    xml,
    q = require('q'),
    deferred = q.defer();

getDailyRepositories = function() {
    var date = new Date();
    date = date.setDate(date.getDate() - 1);
    Repository.find({createdAt:{$gte: date}}, {}, function(err, data) {
        deferred.resolve(data);
    });
    return deferred.promise;
};

generateRSSFeed = function(repositories, feed) {
    var i,
        length,
        repo;
    for(i = 0, length = repositories.length; i < length; i++) {
        repo = repositories[i];
        feed.item({
            title:  repo.name,
            description: repo.description,
            url: config.url + '/#!/?details=' + repo.owner.login + '/' +
                repo.name + '&sort=Descending&sortBy=lowerCaseName',
            date: new Date()
        });
    }
};

job = function(feed) {
    getDailyRepositories()
        .then(function(repos) {
            generateRSSFeed(repos, feed);
            xml = feed.xml();
            fs.writeFileSync('public/rss.xml', xml);
        });
};

//send email everyday on 10:00 am
new CronJob('0 0 10 * * *', job(feed) , null, true);