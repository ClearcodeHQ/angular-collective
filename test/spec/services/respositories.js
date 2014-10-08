'use strict';

describe('Service: Repositories', function () {
  var $rootScope,$httpBackend,Repositories;
  // load the controller's module
  beforeEach(module('angularcolApp'));

  beforeEach(inject(function(_$rootScope_, _$httpBackend_,_Repositories_){
      $rootScope = _$rootScope_;
      $httpBackend = _$httpBackend_;
      Repositories = _Repositories_;
    }));

  // Initialize the controller and a mock scope

  describe('when app is started', function() {
      it('should load repositories list - page one', function() {
        var repos1 = [
          {
            'id': 1905035,
            'name': 'Apache2Piwik',
            'owner': {
              'login': 'clearcode'
            },
            'description': '',
          },
          {
            'id': 4282788,
            'name': 'facebook-sdk',
            'owner': {
              'login': 'clearcode'
            },
            'description': 'Facebook Platform Python SDK'
          },
          {
            'id': 9344809,
            'name': 'flot',
            'owner': {
              'login': 'clearcode'
            },
            'description': 'Attractive JavaScript charts for jQuery'
          },
          {
            'id': 1905022,
            'name': 'Google2Piwik',
            'owner': {
              'login': 'clearcode'
            },
            'description': ''
          },
          {
            'id': 10359126,
            'name': 'jquery.nicescroll',
            'owner': {
              'login': 'clearcode',
            },
            'description': 'nicescroll plugin for jquery - scrollbars like iphone/ipad'
          },
        ];
        $httpBackend.expectGET('/auth/token').respond({});
        $httpBackend.expectGET('api/users/clearcode/repos?page=1&per_page=5').respond(repos1, {'Link':'<https://api.github.com/user/820216/repos?page=2&per_page=5>; rel="next", <https://api.github.com/user/820216/repos?page=3&per_page=5>; rel="last"'});


        var dlrepos;
        Repositories.getRepositories(1).then(function(result){
          dlrepos = result;
        });

        $httpBackend.flush();
        expect(dlrepos.data.length).toBe(5);
      });

      it('should load repositories list - page two', function() {

        var repos2 = [
          {
            'id': 14981536,
            'name': 'migopy',
            'owner': {
              'login': 'clearcode'
            },
            'description': ''
          },
          {
            'id': 8178211,
            'name': 'piwik',
            'owner': {
              'login': 'clearcode',
            },
            'description': 'Piwik is now on GitHub!! Please \'Star\' the project, and we welcome Pull Requests. Piwik aims to be the ultimate open source alternative to Google Analytics. Liberating Web Analytics!',
          },
          {
            'id': 17474760,
            'name': 'py-authorize',
            'owner': {
              'login': 'clearcode',
            },
            'description': 'A Python API for Authorize.net',
          },
          {
            'id': 18554611,
            'name': 'PyBulk',
            'owner': {
              'login': 'clearcode',
              'id': 820216,
            },
            'description': 'PyBulk Salesforce in Python',
          },
          {
            'id': 18441694,
            'name': 'pycard',
            'owner': {
              'login': 'clearcode'
            },
            'description': 'A simple credit card validation Python library with no dependencies',
          },
        ];

        $httpBackend.expectGET('/auth/token').respond({});
        $httpBackend.expectGET('api/users/clearcode/repos?page=2&per_page=5').respond(repos2, {'Link':'<https://api.github.com/user/820216/repos?page=3&per_page=5>; rel="next", <https://api.github.com/user/820216/repos?page=3&per_page=5>; rel="last", <https://api.github.com/user/820216/repos?page=1&per_page=5>; rel="first", <https://api.github.com/user/820216/repos?page=1&per_page=5>; rel="prev"'});


        var dlrepos;
        Repositories.getRepositories(2).then(function(result){
          dlrepos = result;
        });

        $httpBackend.flush();
        expect(dlrepos.data.length).toBe(5);
      });

      it('should load repositories list - page three', function() {

        var repos3 = [
          {
            'id': 19946088,
            'name': 'sfbulk',
            'owner': {
              'login': 'clearcode'
            },
            'description': 'Python wrapper for Salesforce Bulk API'
          }
        ];

        $httpBackend.expectGET('/auth/token').respond({});
        $httpBackend.expectGET('api/users/clearcode/repos?page=3&per_page=5').respond(repos3, {'Link':'<https://api.github.com/user/820216/repos?page=1&per_page=5>; rel="first", <https://api.github.com/user/820216/repos?page=2&per_page=5>; rel="prev"'});


        var dlrepos;
        Repositories.getRepositories(3).then(function(result){
          dlrepos = result;
        });

        $httpBackend.flush();
        expect(dlrepos.data.length).toBe(1);
      });

      it('should get readme for repo', function() {
        $httpBackend.expectGET('/auth/token').respond({});
        $httpBackend.expectGET('api/repos/clearcode/repo1/readme', {'Accept':'application/vnd.github.VERSION.raw'}).respond('test readme', {'Content-Type':'application/vnd.github.VERSION.raw'});

        var dlrepos;
        Repositories.getReadmeForRepo('clearcode','repo1').then(function(result){
          dlrepos = result;
        });

        $httpBackend.flush();
        expect(dlrepos.data).toBe('test readme');
      });

      it('should get bower.json for repo', function() {
        $httpBackend.expectGET('/auth/token').respond({});
        $httpBackend.expectGET('api/repos/clearcode/repo1/bower.json', {'Accept':'application/vnd.github.VERSION.raw'}).respond('{"json":"test"}', {'Content-Type':'application/vnd.github.VERSION.raw'});

        var dlrepos;
        Repositories.getBowerJsonForRepo('clearcode','repo1').then(function(result){
          dlrepos = result;
        });

        $httpBackend.flush();
        expect(JSON.stringify(dlrepos.data)).toBe('{"json":"test"}');
      });

      it('should get fallback repo', function() {
        $httpBackend.expectGET('/auth/token').respond({});
        $httpBackend.expectGET('api/search/repositories?q=migopy+in:name+user:clearcode').respond('{"json":"test"}');

        var dlrepos;
        Repositories.getFallbackRepo('migopy','clearcode').then(function(result){
          dlrepos = result;
        });

        $httpBackend.flush();
        expect(JSON.stringify(dlrepos.data)).toBe('{"json":"test"}');
      });

      it('should search for repositories', function(){
        var repos2 = [
          {
            'id': 14981536,
            'name': 'migopy',
            'owner': {
              'login': 'clearcode'
            },
            'description': ''
          },
          {
            'id': 8178211,
            'name': 'piwik',
            'owner': {
              'login': 'clearcode',
            },
            'description': 'Piwik is now on GitHub!! Please \'Star\' the project, and we welcome Pull Requests. Piwik aims to be the ultimate open source alternative to Google Analytics. Liberating Web Analytics!',
          },
          {
            'id': 17474760,
            'name': 'py-authorize',
            'owner': {
              'login': 'clearcode',
            },
            'description': 'A Python API for Authorize.net',
          },
          {
            'id': 18554611,
            'name': 'PyBulk',
            'owner': {
              'login': 'clearcode',
              'id': 820216,
            },
            'description': 'PyBulk Salesforce in Python',
          },
          {
            'id': 18441694,
            'name': 'pycard',
            'owner': {
              'login': 'clearcode'
            },
            'description': 'A simple credit card validation Python library with no dependencies',
          },
        ];

        $httpBackend.expectGET('/auth/token').respond({});
        $httpBackend.expectGET('api/search/repositories?page=1&per_page=5&q=').respond(repos2, {'Link':'<https://api.github.com/user/820216/repos?page=3&per_page=5>; rel="next", <https://api.github.com/user/820216/repos?page=3&per_page=5>; rel="last", <https://api.github.com/user/820216/repos?page=1&per_page=5>; rel="first", <https://api.github.com/user/820216/repos?page=1&per_page=5>; rel="prev"'});


        var dlrepos;
        Repositories.searchRepositories(1,'test','clearcode').then(function(result){
          dlrepos = result;
        });

        $httpBackend.flush();
        expect(dlrepos.data.length).toBe(5);
      });




    });
});
