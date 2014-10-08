'use strict';

angular.module('angularcolApp').service('Repositories', ['$http', 'userToken', function($http, userToken) {
    this.getRepositories = function(page, user, filter, sort, sortBy) {
        filter = filter || 'A-Z';
        var url,
            params;
        switch(filter){
            case('A-Z'):
                url = 'api/users/clearcodeangularjs/repos';
                params = {
                    page:page
                };
                break;
            case('Newest'):
                url = 'api/users/clearcodeangularjs/repos';
                params = {
                    page:page,
                    filter:filter
                };
                break;
            case('Likes'):
                url = 'api/users/clearcodeangularjs/repos';
                params = {
                    page:page,
                    filter:filter
                };
                break;
            case('ClearCode'):
                url = 'api/search/repositories';
                params = {
                    q:'user:jaciej',
                    forked:false,
                    page:page
                };
                break;
            case('Others'):
                url = 'api/search/repositories';
                params = {
                    q:'user:jaciej',
                    forked:true,
                    page:page
                };
                break;
            case('Directives'):
                url = 'api/search/repositories';
                params = {
                    q:'directive in:name user:' + user,
                    page:page
                };
                break;
            case('Services'):
                url = 'api/search/repositories';
                params = {
                    q:'service in:name user:' + user,
                    page:page
                };
                break;
            case('Filters'):
                url = 'api/search/repositories';
                params = {
                    q:'filter in:name user:' + user,
                    page:page
                };
        }
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        params.per_page = 5;
        // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
        params.sortBy = sortBy;
        params.sort = sort;
        return $http.get(url, {params:params});
    };

    this.getReadmeForRepo = function(user, repo) {
        return $http.get('api/repos/' + user + '/' + repo +
          '/readme', {headers:{Accept:'application/vnd.github.VERSION.raw'}});
    };

    this.getBowerJsonForRepo = function(user, repo) {
        return $http.get('api/repos/' + user + '/' + repo +
          '/bower.json', {headers:{Accept:'application/vnd.github.VERSION.raw'}});
    };

    this.searchRepositories = function(page, repo, user, sort, sortBy) {
        var params = {
            q:'',
            name: repo.name,
            dependency: repo.dependency,
            project: repo.project,
            tag: repo.tag,
            page:page,
            // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
            per_page:5,
            // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
            sortBy:sortBy,
            sort:sort
        },
        url = 'api/search/repositories';
        return $http.get(url, {params:params});
    };

    this.getFallbackRepo = function(name, user) {
        var params = {
            q:name + ' in:name user:' + user
        },
        url = 'api/search/repositories';
        return $http.get(url, {params:params});
    };

    this.getCurrentUser = function() {
        return $http.get('/api/currentuser');
    };

    this.getCurrentUserToken = function() {
        return $http.get('/auth/token');
    };

    this.getCurrentUserToken().then(function(data) {
        userToken.token = data.data;
    });

    this.clearToken = function() {
        delete userToken.token;
    };

    this.getTags = function(sort) {
        var params = {
            sort: sort
        }
        return $http.get('/api/tags', {params:params});
    };

    this.getProjects = function() {
        var params = {
            facet: 'project'
        }
        return $http.get('/api/facets/value', {params:params});
    };

    this.addToNewsletter = function(mail) {
        var params = {
            mail: mail
        }
        return $http.get('/api/newsletterAdd', {params:params});
    };

    this.updateRepo = function(repo) {
        return $http({
            url: '/api/repo/update',
            method: 'POST',
            // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
            data: JSON.stringify(
                {
                    id:repo.id,
                    bower_json:{keywords:repo.bower_json.keywords},
                    addedProjects: repo.addedProjects,
                    removedProjects:repo.removedProjects
                }),
            // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
            headers: {'Content-Type': 'application/json'}
        });
    }
    this.voteForRepo = function(id, vote) {
        var params = {
            id: id,
            vote: vote
        }
        return $http.get('/api/addVote', {params:params});
    }
}]);
