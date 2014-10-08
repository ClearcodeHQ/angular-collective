'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    async = require('async'),
    https = require('https'),
    url = require('url'),
    config = require('../../config/config'),
    Repository = mongoose.model('Repository'),
    Project = mongoose.model('Project'),
    paginatedResults,
    createMockBowerJson,
    createMockRepositoriesForUser,
    generatePages,
    generateLinkstoPages,
    sendMockPage,
    syncDatafromGitHub,
    prepareDependencyFacets,
    prepareProjectFacets,
    addToQueryObject,
    prepareTagFacets,
    searchRepositorieshelper,
    addProjectToRepository,
    deleteProjectFromRepository,
    compressArray,
    sendToGit,
    user = config.gitUser,
    id = config.github.clientID,
    secret = config.github.clientSecret;

compressArray = function(original, forList) {
    var compressed,
    copy = original.slice(0),
    i,
    myCount,
    j,
    obj,
    forList = forList || false;
    forList ? compressed = {} : compressed = [];
    for(i = 0; i < original.length; i++) {
        myCount = 0;
        for(j = 0; j < copy.length; j++) {
            if(original[i] == copy[j]) {
                myCount++;
                delete copy[j];
            }
        }
        if(myCount > 0) {
            obj = {};
            obj.value = original[i];
            obj.count = myCount;
            if(!forList) {
                compressed.push(obj);
            }
            else {
                compressed[obj.value.charAt(0)] = compressed[obj.value.charAt(0)] || [];
                compressed[obj.value.charAt(0)].push(obj);
            }
        }
    }
    return compressed;
};

/**
  * Gets paginated data from DB with options object
  * @param {number} page     number of page to get
  * @param {number} per_page results per page
  * @param {String} url      url for pagination
  * @param {Object} options  pagination options such as sort, select etc
  * @param {Object} res      node.js response object
  */

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
paginatedResults = function(query, page, per_page, url, options, res, user) {
    var pages, links, i, j, length, voteLength, current, currentVote, userVote, paginatedResultsMod;
    query = query || {};
    Repository.paginate(query, page, per_page, function(error, pageCount, paginatedResults, itemCount) {
        if(error) {
            console.error(error);
        }
        else {
            paginatedResultsMod = paginatedResults;
            pages = generatePages(page, pageCount);
            links = generateLinkstoPages(url, pages);
            res.set('Link', links);
            if(user) {
                paginatedResultsMod = [];
                for(i=0, length = paginatedResults.length; i < length; i++) {
                    userVote = 0;
                    current = paginatedResults[i].toObject();
                    for(j=0, voteLength = current.votes.length; j < voteLength; j++) {
                        currentVote = current.votes[j];
                        if(currentVote.userEmail === user._json.mail) {
                            userVote = currentVote.vote;
                        }
                    }
                    current.userVote = userVote;
                    paginatedResultsMod.push(current);
                }
            }
            res.jsonp(paginatedResultsMod);
        }
    }, options);
};
// jscs:enable requireCamelCaseOrUpperCaseIdentifiers

/**
  * Function generating pages object (similiar to GitHub)
  * @param {Number} current current page number
  * @param {Number} max     last page number
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

/**
  * Function that generates links header for front-end pagnation
  * @param {String} address Address for query
  * @param {Object} pages   Pages object that contains pages information (first/previous/next/last page number)
  */
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
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
exports.getAllRepositories = function(req, res) {
    var query = req.query;
    if(query.filter === 'Newest') {
        paginatedResults({}, query.page, query.per_page, req.url,
            {populate: 'projects', sortBy: {updated_at: -1}}, res, req.user);
    }
    else
    if(query.filter === 'Likes') {
        paginatedResults({}, query.page, query.per_page, req.url, {sortBy: {voteSum: -1}}, res, req.user);
    }
    else {
        paginatedResults({}, query.page, query.per_page, req.url,
            {populate: 'projects', sortBy: {lowerCaseName: 1}}, res, req.user);
    }
};
// jscs:enable requireCamelCaseOrUpperCaseIdentifiers
addProjectToRepository = function(project, repoId) {
   // if(req.user && req.user._json && req.user._json.login === admin) {
    Project.findOneAndUpdate(
                    {name: project},
                    {name: project},
                    {upsert: true},
                    function(err, object) {
                        Repository.findOneAndUpdate(
                                    {id: repoId},
                                    {$addToSet: {projects: mongoose.Types.ObjectId(object._id)}},
                                    {},
                                    function(err, object) {}
                                );
                    }
        );
   // }
};

exports.deleteProject = function(req, res) {
    if(req.user._json.login === user) {
        Project.findOne({name: req.body.name}, function(err, proj) {
            proj.remove();
        });
    }
};

deleteProjectFromRepository = function(project, repoId) {
    Project.findOneAndUpdate(
        {name: project},
        {name: project},
        {},
        function(err, object) {
            Repository.findOneAndUpdate(
                {id: repoId},
                {$pull: {projects: object._id}},
                {},
                function(err, object) {
                }
            );
        }
    );
};

/**
  * Provide README for repository downloaded from Github, when Git won't find any it will provide fallback info.
  * @param {Object} req node.js request object
  * @param {Object} res node.js response object
  */
exports.getReadmeForRepo = function(req, res) {
    var path = '/repos/' + req.params.user + '/' + req.params.repository + '/readme',
        header = {Accept: 'application/vnd.github.VERSION.raw', 'User-Agent': 'Angular collective'},
        req2;
    if(req.session.gitToken) {
        header.Authorization = ('token ' + req.session.gitToken);
    }
    req2 = https.request({hostname: 'api.github.com', path: path, headers: header} , function(res2) {
        var data = '';
        res2.setEncoding('utf8');
        res2.on('data', function(chunk) {
            if(res2.statusCode === 403) {
                data += 'Download limit for unauthorized users exceeded, please log in to download README file.';
            }
            else{
                if(chunk === '{"message":"Not Found","documentation_url":"https://developer.github.com/v3"}') {
                    data += 'README not found!';
                }
                else {
                    data += chunk;
                }
            }
        });
        res2.on('end', function() {
            res.write(data);
            res.end();
        });
    });
    req2.end();
};
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
exports.getBowerJsonForRepo = function(req, res) {
    Repository.findOne({name: req.params.repository, 'owner.login': req.params.user}).exec(function(err, repository) {
        res.json(repository.bower_json);
    });
};

addToQueryObject = function(array, name, queryObject) {
    if(!(array instanceof Array)) {
        var splittedQuery = array.split(',');
        if(splittedQuery.length === 1) {
            queryObject[name] = array;
        }
        else{
            queryObject[name] = {$all: splittedQuery};
        }
    }
    else{
        queryObject[name] = {$all: array};
    }
};

exports.searchRepositories = function(req, res) {
    if(req.query.project) {
        if(!(req.query.project instanceof Array)) {
            req.query.project = [req.query.project];
        }
        async.map(req.query.project, function(project, callback) {
            Project.findOne({name:project}, function(err, dbproject) {
                callback(null, dbproject._id);
            });
        }, function(err, results) {
            req.query.project = results;
            searchRepositorieshelper(req, res);
        });
    }
    else{
        searchRepositorieshelper(req, res);
    }
};

searchRepositorieshelper = function(req, res) {
    var query,
        queryArray,
        queryObject,
        resp,
        links,
        sortObj = {},
        querry = {};
    sortObj[req.query.sortBy] = (req.query.sort === 'Descending' ? -1 : 1);
    query = req.query.q.split(' ');
    if(query[0].split(':').length === 1) {
        query[0] = 'query:' + query[0];
    }
    queryArray = _.map(query, function(lol) {
        return lol.split(':');
    });
    queryObject = _.zipObject(queryArray);
    if(!req.query.page) {
        Repository.findOne({name: queryObject.query, 'owner.login': queryObject.user})
            .populate('projects')
            .exec(function(err, repository) {
                res.json(repository);
            });
    }
    else{
         // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        if(!queryObject.query && !req.query.name && !req.query.dependency && !req.query.project && !req.query.tag) {
            paginatedResults({'owner.login': queryObject.user, fork: req.query.forked},
              req.query.page, req.query.per_page, req.url, {populate: 'projects', sortBy: sortObj}, res, req.user);
        }
        else{
            if(queryObject.query && queryObject.user) {
                paginatedResults({name: new RegExp(queryObject.query, 'i'), 'owner.login': queryObject.user},
                  req.query.page, req.query.per_page, req.url, {populate: 'projects', sortBy: sortObj}, res, req.user);
            }
            else {
                if(req.query.name) {
                    querry.name = new RegExp(req.query.name, 'i');
                }
                if(req.query.dependency) {
                    addToQueryObject(req.query.dependency, 'dependenciesArray', querry);
                }
                if(req.query.project) {
                    addToQueryObject(req.query.project, 'projects', querry);
                }
                if(req.query.tag) {
                    addToQueryObject(req.query.tag, 'bower_json.keywords', querry);
                }
                paginatedResults(querry, req.query.page, req.query.per_page, req.url,
                    {populate: 'projects', sortBy: sortObj}, res, req.user);
            }
        }
    }
         // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
}

prepareDependencyFacets = function(facet, data) {
    var facetArray = [];
    _.forEach(data, function(val) {
        facetArray.push(_.keys(val));
    });
    facetArray = _.uniq(_.flatten(facetArray));
    facetArray =  _.sortBy(facetArray, function(s) {
        return s.charCodeAt();
    });
    return _.map(facetArray, function(val) {
        return {label: val, category: facet};
    });
};

prepareTagFacets = function(facet, data) {
    data = _.uniq(data);
    data =  _.sortBy(data, function(s) {
        return s.charCodeAt();
    });
    return _.map(data, function(val) {
        return {label: val, category: facet};
    });
};

exports.getFacets = function(req, res) {
    var facetArray = [
                        {label: 'name', category: 'repository'},
                        {label: 'dependency', category: 'module'},
                        {label: 'project', category: 'module'},
                        {label: 'tag', category: 'module'}
                    ];
    res.json(facetArray);
};

exports.getValuesforFacet = function(req, res) {
    switch(req.query.facet) {
        case('project'):
            Project.distinct('name', {}, function(err, data) {
                res.json(prepareTagFacets(req.query.facet, data));
            });
            break;
        case('dependency'):
            Repository.distinct('bower_json.dependencies', {}, function(err, data) {
                res.json(prepareDependencyFacets(req.query.facet, data));
            });
            break;
        case('name'):
            res.json([]);
            break;
        case('tag'):
            Repository.distinct('bower_json.keywords', {}, function(err, data) {
                res.json(prepareTagFacets(req.query.facet, data));
            });
            break;
    }
};

// gets all tags represented as object containing name and number of occurences
exports.getAllTags = function(req, res) {
    var extracted,
        flattened,
        compressed;
    Repository.find({}, {'bower_json.keywords':1, _id:0}, function(err, data) {
        extracted = _.map(data, function(val) {
            // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
            return val.bower_json.keywords || []
            // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
        });
        flattened = _.flatten(extracted);
        if(req.query.sort !== 'usage' && req.query.sort !== 'alphabetical') {
            compressed = compressArray(flattened, true);
        }
        else {
            compressed = compressArray(flattened);
        }
        if(req.query.sort === 'usage') {
            res.json(_.sortBy(compressed, 'count').reverse());
        }
        else {
            if(req.query.sort === 'alphabetical') {
                res.json(_.sortBy(compressed, 'value'));
            }
            else {
                res.json(compressed);
            }
        }
    });
};

exports.addVote = function(req, res) {
    var vote = 0,
    v,
    prevVote = 0,
    i,
    length,
    current;

    if(req.user._json.email) {
        if(req.query.vote === 'upVote') {
            vote = 1;
        }
        else {
            if(req.query.vote === 'downVote') {
                vote = -1;
            }
        }

        Repository.findOne(
            {
                id:req.query.id
            },
            function(err, obj) {
                for(i=0, length=obj.votes.length; i < length; i++) {
                    current = obj.votes[i];
                    console.log(current.userMail, req.user._json.email);
                    if(current.userMail === req.user._json.email) {
                        prevVote = current.vote;
                    }
                }
                if((prevVote + vote) >= -1 && (prevVote + vote) <= 1) {
                    Repository.findOneAndUpdate(
                        {
                            id:req.query.id
                        },
                        {
                            $pull:{
                                votes: {
                                    userMail: req.user._json.email
                                }
                            }
                        },
                        {
                        },
                        function(err, object) {
                            console.log(err);
                            Repository.findOneAndUpdate(
                            {
                                id:req.query.id
                            },
                            {
                                $inc: {
                                    voteSum: vote
                                },
                                $push:{
                                    votes: {
                                        userMail: req.user._json.email,
                                        vote: prevVote + vote
                                    }
                                }
                            },
                            {
                            },
                            function(err, object) {
                                var i,
                                    length,
                                    current,
                                    obj;
                                obj = object.toObject();
                                for(i = 0, length = object.votes.length; i < length; i++) {
                                    current = object.votes[i];
                                    if(req.user._json.email === current.userMail) {
                                        obj.userVote = current.vote;
                                    }
                                }
                                console.log(obj);
                                res.json(obj);
                            });
                        });
                }
                else {
                    res.status(418).end();
                }
            });
    }
};

exports.updateRepo = function(req, res) {
    var i,
        length,
        current;
    if(req.user && req.user._json && req.user._json.login === user) {
        Repository.findOneAndUpdate(
        {
            id:req.body.id
        },
        {
               // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
            'bower_json.keywords':req.body.bower_json.keywords
               // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
        },
        {
        },
        function(err, object) {
            sendToGit(object, req.session.gitToken);
        });
        if(req.body.addedProjects.length > 0) {
            for(i=0, length = req.body.addedProjects.length; i < length; i++) {
                current = req.body.addedProjects[i];
                addProjectToRepository(current, req.body.id);
            }
        }
        if(req.body.removedProjects.length > 0) {
            for(i=0, length = req.body.removedProjects.length; i < length; i++) {
                current = req.body.removedProjects[i];
                deleteProjectFromRepository(current, req.body.id);
            }
        }
        res.status(200);
        res.end();
    }
};

sendToGit = function(repo, user) {
    var bower,
        base64Bower,
        header,
        path,
        sha,
        data = '',
        sendObj = {},
        req,
        req2,
        unescapeDependencies;
    unescapeDependencies = function(dependObject, origArray) {
        var reg = /[$-]/g,
        escapedId;
        _.forEach(dependObject, function(val, id) {
            if(id.match(reg)) {
                escapedId = id.replace(reg, '.');
                if(origArray.indexOf(escapedId) !== -1) {
                    dependObject[escapedId] = dependObject[id];
                    delete dependObject[id];
                }
            }
        });
        return dependObject;
    };
    path = '/repos/' + repo.owner.login + '/' + repo.name +
        '/contents/bower.json' + '?client_id=' + id + '&client_secret=' + secret;
    header = {'User-Agent':'Angular collective'};
    req = https.request({hostname:'api.github.com', path:path, headers:header}, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            data += chunk;
        });

        res.on('end', function() {
            sha = JSON.parse(data).sha;
               // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
            repo.bower_json.dependencies = unescapeDependencies(repo.bower_json.dependencies, repo.dependenciesArray);
            repo.bower_json.devDependencies = unescapeDependencies(repo.bower_json.devDependencies,
                repo.devDependenciesArray);
            bower = JSON.stringify(repo.bower_json, null, '\t');
               // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
            base64Bower = new Buffer(bower).toString('base64');
            sendObj.message = 'AngCol update';
            sendObj.content = base64Bower;
            sendObj.sha = sha;
            sendObj = JSON.stringify(sendObj);
            path = '/repos/' + repo.owner.login + '/' + repo.name + '/contents/bower.json';
            req2 = https.request(
                {
                    hostname:'api.github.com',
                    path:path,
                    headers:
                        {
                            'User-Agent':'Angular collective',
                            'Content-Type': 'application/json',
                            'Content-Length': sendObj.length,
                            Authorization: 'token ' + user
                        },
                    method:'PUT'
                }, function(res2) {
                    var responseString = '';
                    res2.setEncoding('utf-8');
                });
            req2.write(sendObj);
            req2.end();
        });
    });
    req.end();
}
