'use strict';

var _ = require('lodash'),
    https = require('https'),
    mongoose = require('mongoose'),
    CronJob = require('cron').CronJob,
    config = require('../../config/config'),
    Repository = mongoose.model('Repository'),
    syncDatafromGitHub,
    importFromGit,
    getBowerJson,
    getData,
    preparePaging,
    escapeDependencies,
    token = config.token,
    user = config.gitUser,
    id = config.github.clientID,
    secret = config.github.clientSecret,
    job;

preparePaging = function(link) {
    var reg = /[\?&]page=(\d+)>; rel=\"(.*?)\"/g,
    match,
    linkObj = {};
    while((match = reg.exec(link)) !== null) {
        linkObj[match[match.length - 1]] = match[1];
    }
    return linkObj;
};

getData = function(path, id, secret, header, callback , data, page, pages, mainPath) {
    data = '';
    page = page || 1 ;
    path += '?client_id=' + id + '&client_secret=' + secret;
    mainPath = mainPath || path;
    _.defaults(header , {'User-Agent':'Angular collective'});
    if(pages) {
        path = mainPath + '&page=' + page;
    }
    var req = https.request({hostname:'api.github.com', path:path, headers:header} , function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function() {
            if(res.headers.link) {
                pages = pages || preparePaging(res.headers.link);
            }
            if(pages && page < pages.last) {
                page += 1;
                callback(JSON.parse(data));
                return getData(path, id, secret, header, callback, data, page, pages, mainPath);
            }
            callback(JSON.parse(data));
        });
    });
    req.end();
};

escapeDependencies = function(dependObject) {
    var reg = /[$.]/g,
        escapedId;
    _.forEach(dependObject, function(val, id) {
        if(typeof val === 'object' && !Array.isArray(val)) {
            val = escapeDependencies(val);
        }
        else if(id.match(reg)) {
            escapedId = id.replace(reg, '-');
            dependObject[escapedId] = dependObject[id];
            delete dependObject[id];
        }
    });
    return dependObject;
}

importFromGit = function(data) {
    if(Array.isArray(data)) {
        _.forEach(data, function(val) {
            var path = '/repos/' + val.owner.login + '/' + val.name + '/contents/bower.json';
            getData(path, id, secret, {Accept:'application/vnd.github.VERSION.raw'}, function(bowerjs) {
                Repository.findOneAndUpdate({
                    id:val.id
                },
              {
                  id: val.id,
                  name: val.name,
                  lowerCaseName: (val.name).toLowerCase(),
                  description: val.description,
                 // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                  full_name: val.full_name,
                  owner: {
                      login:val.owner.login,
                      avatar_url: val.owner.avatar_url,
                      html_url: val.owner.html_url
                  },
                  html_url: val.html_url,
                  created_at: val.created_at,
                  updated_at: val.updated_at,
                  pushed_at: val.pushed_at,
                  git_url: val.git_url,
                  homepage: val.homepage,
                  fork: val.fork,
                  $setOnInsert: {
                      createdAt: Date.now(),
                      voteSum: 0
                  },
                  dependenciesArray:_.keys(bowerjs.dependencies),
                  devDependenciesArray:_.keys(bowerjs.devDependencies),
                  bower_json: escapeDependencies(bowerjs)
              },
                    {
                        upsert:true
                    },
                      function(err, object) {
                          console.log(err);
                      });
            });
        });
    }
};
            // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
if(!config.test) {
    job = function() {
        getData('/users/' + user + '/repos', id, secret , {}, importFromGit);
    };

    job();

    new CronJob('0 0 * * * *', job , null, true);
}
