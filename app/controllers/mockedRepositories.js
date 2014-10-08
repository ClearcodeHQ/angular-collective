'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    async = require('async'),
    url = require('url'),
    config = require('../../config/config'),
    Repository = mongoose.model('Repository'),
    Project = mongoose.model('Project'),
    createMockData,
    createMockReadme,
    createMockBowerJson,
    createMockFallbackData,
    createMockRepositoriesForUser,
    createMockSearch,
    generatePages,
    generateLinkstoPages,
    sendMockPage,
    syncDatafromGitHub,
    admin = config.user;

/**
  * Old controller with all mockRepo functions.
  */

generatePages = function(current, max) {
    var pages = {};
    current = parseInt(current, 10);
    if(current >= 1 && current <= max) {
        if(current < max) {
            pages.last = max;
            pages.next = current + 1;
        }
        if(current > 1) {
            pages.first = 1;
            pages.prev = current - 1;
        }
    }
    return pages;
};

generateLinkstoPages = function(address, pages) {
    var urlString = '',
        urlObj = url.parse(address, true),
        header;
    delete urlObj.search;

    _.forEach(pages, function(val, key) {
        urlObj.query.page = val;
        urlString += '<' + url.format(urlObj) + '>; rel="' + key + '" ';
    });

    return urlString;
};

sendMockPage = function(resp, page) {
    var json,
        pages;
    json = JSON.parse(resp);
    pages = generatePages(page, json.length);
    return {json:json[page - 1], pages:pages};
};

createMockData = function(type, page) {
    var resp;
    if(type === 'A-Z' && page >= 1) {
        resp = fs.readFileSync(process.cwd() + '/app/mocks/azmock.json', {encoding:'utf8'});

        return sendMockPage(resp, page);
    }
    else{
        if(type === 'Newest' && page >= 1) {
            resp = fs.readFileSync(process.cwd() + '/app/mocks/newestmock.json', {encoding:'utf8'});
            return sendMockPage(resp, page);
        }
    }
};

createMockReadme = function(repo) {
    var resp = '';
    if(repo === 'Apache2Piwik') {
        resp = fs.readFileSync(process.cwd() + '/app/mocks/readme', {encoding:'utf8'});
        return resp;
    }
};

createMockBowerJson = function(repo) {
    var resp;
    if(repo === 'Apache2Piwik') {
        resp = fs.readFileSync(process.cwd() + '/app/mocks/bower.json', {encoding:'utf8'});
        return JSON.parse(resp);
    }
};

createMockFallbackData = function(name, user) {
    if(user === 'clearcode' && name === 'migopy') {
        var fallback = fs.readFileSync(process.cwd() + '/app/mocks/mockFallback.json', {encoding:'utf8'});
        return JSON.parse(fallback);
    }
};

createMockRepositoriesForUser = function(name, page) {
    var resp,
        json,
        pages;

    if(name === 'clearcode' && page >= 1) {
        resp = fs.readFileSync(process.cwd() + '/app/mocks/clearCode.json', {encoding:'utf8'});
        return sendMockPage(resp, page);
    }
};

createMockSearch = function(query, user, page) {
    var json,
        resp,
        pages,
        response;
    if(page >= 1) {
        switch(query){
            case 'directive':
                resp = fs.readFileSync(process.cwd() + '/app/mocks/directives.json', {encoding:'utf8'});

                return sendMockPage(resp, page);
            case'service':
                resp = fs.readFileSync(process.cwd() + '/app/mocks/services.json', {encoding:'utf8'});

                return sendMockPage(resp, page);
            case 'filter':
                resp = fs.readFileSync(process.cwd() + '/app/mocks/filters.json', {encoding:'utf8'});

                return sendMockPage(resp, page);
            case 'test':
                resp = fs.readFileSync(process.cwd() + '/app/mocks/test.json', {encoding:'utf8'});

                return sendMockPage(resp, page);
        }
    }
};

exports.getAllRepositories = function(req, res) {
    var query = req.query,
        responseObject,
        links;
    if(query.sort === 'updated') {
        responseObject = createMockData('Newest', query.page);
        links = generateLinkstoPages(req.url, responseObject.pages);
        res.set('Link', links);
        res.json(responseObject.json);
    }
    else{
        responseObject = createMockData('A-Z', query.page);
        links = generateLinkstoPages(req.url, responseObject.pages);
        res.set('Link', links);
        res.json(responseObject.json);
    }
};

exports.addProjectToRepository = function(req, res) {
    if(req.user._json.login === admin) {
        Project.findOneAndUpdate(
            {name: req.body.name},
            {name: req.body.name},
            {upsert:true},
            function(err, object) {
                Repository.findOneAndUpdate(
                    {id:req.body.id},
                    {$push:{projects:[object._id]}},
                    {},
                    function(err, object) {}
                );
            }
        );
    }
};

exports.deleteProject = function(req, res) {
    if(req.user._json.login === admin) {
        Project.findOne({name:req.body.name}, function(err, proj) {
            proj.remove();
        });
    }
};

exports.deleteProjectFromRepository = function(req, res) {
    if(req.user._json.login === admin) {
        Project.findOneAndUpdate(
            {name:req.body.name},
            {name: req.body.name},
            {},
            function(err, object) {
                Repository.findOneAndUpdate(
                    {id:req.body.id},
                    {$pull:{projects:[object._id]}},
                    {},
                    function(err, object) {}
                );
            }
        );
    }
};

exports.getReadmeForRepo = function(req, res) {
    var readme = createMockReadme(req.params.repository);
    res.write(readme);
    res.end();
};

exports.getBowerJsonForRepo = function(req, res) {
    var bower = createMockBowerJson(req.params.repository);
    res.json(bower);
};

exports.searchRepositories = function(req, res) {
    var query,
        queryArray,
        queryObject,
        resp,
        links;

    query = req.query.q.split(' ');
    if(query[0].split(':').length === 1) {
        query[0] = 'query:' + query[0];
    }
    queryArray = _.map(query, function(lol) {
        return lol.split(':');
    });
    queryObject = _.zipObject(queryArray);
    if(!req.query.page) {
        resp = createMockFallbackData(queryObject.query, queryObject.user);
        res.json(resp);
    }
    else{
        if(!queryObject.query) {
            resp = createMockRepositoriesForUser(queryObject.user, req.query.page);
            links = generateLinkstoPages(req.url, resp.pages);
            res.set('Link', links);
            res.json(resp.json);
        }
        else{
            if(queryObject.query && queryObject.user) {
                resp = createMockSearch(queryObject.query, queryObject.user, req.query.page);
                links = generateLinkstoPages(req.url, resp.pages);
                res.set('Link', links);
                res.json(resp.json);
            }
        }
    }
};
