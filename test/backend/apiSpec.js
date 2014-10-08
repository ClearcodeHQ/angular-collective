'use strict';
var request = require('request'),
  spawn = require('child_process').spawn,
  query;

beforeEach(function() {
  var ready;
  runs( function () {
    var args = ['--db', 'mean-test', '--drop' ,'app/mocks/dbDump/mean-test'],
      mongorestore = spawn('mongorestore', args);
    mongorestore.on('close', function () {
      ready = true;
    });
  });
   waitsFor(function () { return !!ready; } , 'Timed out', 1000);
});


describe('angular collective backend api', function(){
  describe('getting all repositories sorted by modified time', function(){
    beforeEach(function(){
      query = {
        filter:'Newest',
        page:1,
        per_page:5,
        sort:'Descending',
        sortBy:'lowerCaseName'
      };
    });

    it('should download exactly 5 repositories', function(done){
      var test;
      request({url:'http://localhost:3001/api/users/clearcode/repos', qs:query}, function(error, response){
        test = JSON.parse(response.body);
        expect(test.length).toEqual(5);
        done();
      });
    });

    it('repositories should be sorted by modified date, should not check sort and sortBy params', function(done){
      var test;
      request({url:'http://localhost:3001/api/users/clearcode/repos', qs:query}, function(error, response){
        test = JSON.parse(response.body);
        expect(test[0].name).toEqual('angular.js');
        done();
      });
    });
  });

  describe('getting all repositories sorted alphabetically', function(){
    beforeEach(function(){
      query = {
        filter:'A-Z',
        page:1,
        per_page:5,
        sort:'Descending',
        sortBy:'lowerCaseName'
      };
    });

    it('should download exactly 5 repositories', function(done){
      var test;
      request({url:'http://localhost:3001/api/users/clearcode/repos', qs:query}, function(error, response){
        test = JSON.parse(response.body);
        expect(test.length).toEqual(5);
        done();
      });
    });

    it('repositories should be sorted alphabetically, should not check sort and sortBy params', function(done){
      var test;
      request({url:'http://localhost:3001/api/users/clearcode/repos', qs:query}, function(error, response){
        test = JSON.parse(response.body);
        expect(test[0].name).toEqual('1');
        done();
      });
    });
  });


  describe('getting all repositories that belongs to main user', function(){
    beforeEach(function(){
      query = {
        q:'user:angular',
        forked:false,
        page:1,
        per_page:5,
        sort:'Descending',
        sortBy:'lowerCaseName'
      };
    });

    it('should download exactly 5 repositories', function(done){
      var test;
      request({url:'http://localhost:3001/api/search/repositories', qs:query}, function(error, response){
        test = JSON.parse(response.body);
        expect(test.length).toEqual(5);
        done();
      });
    });

    it('repositories should be sorted according to params', function(done){
      var test;
      request({url:'http://localhost:3001/api/search/repositories', qs:query}, function(error, response){
        test = JSON.parse(response.body);
        expect(test[0].name).toEqual('zone.js');
        done();
      });
    });
  });

  describe('getting all repositories that belongs to other users', function(){
    beforeEach(function(){
      query = {
        q:'user:angular',
        forked:true,
        page:1,
        per_page:5,
        sort:'Descending',
        sortBy:'lowerCaseName'
      };
    });

    it('should download exactly 2 repositories', function(done){
      var test;
      request({url:'http://localhost:3001/api/search/repositories', qs:query}, function(error, response){
        test = JSON.parse(response.body);
        expect(test.length).toEqual(2);
        done();
      });
    });

    it('repositories should be sorted according to params', function(done){
      var test;
      request({url:'http://localhost:3001/api/search/repositories', qs:query}, function(error, response){
        test = JSON.parse(response.body);
        expect(test[0].name).toEqual('ng-darrrt-codelab');
        done();
      });
    });
  });

  describe('getting all directives', function(){
    beforeEach(function(){
      query = {
        q:'directive in:name user:angular',
        forked:true,
        page:1,
        per_page:5,
        sort:'Descending',
        sortBy:'lowerCaseName'
      };
    });

    it('should download exactly 1 repository', function(done){
      var test;
      request({url:'http://localhost:3001/api/search/repositories', qs:query}, function(error, response){
        test = JSON.parse(response.body);
        expect(test.length).toEqual(1);
        done();
      });
    });

    it('repositories should be sorted according to params', function(done){
      var test;
      request({url:'http://localhost:3001/api/search/repositories', qs:query}, function(error, response){
        test = JSON.parse(response.body);
        expect(test[0].name).toEqual('angular-hint-directives');
        done();
      });
    });
  });

  describe('getting search by name', function(){
    beforeEach(function(){
      query = {
        q:'angular in:name user:angular',
        forked:true,
        page:1,
        per_page:5,
        sort:'Descending',
        sortBy:'lowerCaseName'
      };
    });

    it('should download exactly 5 repositories', function(done){
      var test;
      request({url:'http://localhost:3001/api/search/repositories', qs:query}, function(error, response){
        test = JSON.parse(response.body);
        expect(test.length).toEqual(5);
        done();
      });
    });

    it('repositories should be sorted according to params', function(done){
      var test;
      request({url:'http://localhost:3001/api/search/repositories', qs:query}, function(error, response){
        test = JSON.parse(response.body);
        expect(test[0].name).toEqual('docs.angulardart.org');
        done();
      });
    });
  });

    describe('getting search by tag', function(){
    beforeEach(function(){
      query = {
        q: '',
        tag: 'none',
        forked:true,
        page:1,
        per_page:83,
        sort:'Descending',
        sortBy:'lowerCaseName'
      };
    });

    it('should download exactly 83 repositories', function(done){
      var test;
      request({url:'http://localhost:3001/api/search/repositories', qs:query}, function(error, response){
        test = JSON.parse(response.body);
        expect(test.length).toEqual(83);
        done();
      });
    });

    it('repositories should be sorted according to params', function(done){
      var test;
      request({url:'http://localhost:3001/api/search/repositories', qs:query}, function(error, response){
        test = JSON.parse(response.body);
        expect(test[0].name).toEqual('zone.js');
        done();
      });
    });
  });

describe('getting search by dependency', function(){
    beforeEach(function(){
      query = {
        q: '',
        dependency: 'angular',
        forked:true,
        page:1,
        per_page:83,
        sort:'Descending',
        sortBy:'lowerCaseName'
      };
    });

    it('should download exactly 22 repositories', function(done){
      var test;
      request({url:'http://localhost:3001/api/search/repositories', qs:query}, function(error, response){
        test = JSON.parse(response.body);
        expect(test.length).toEqual(22);
        done();
      });
    });

    it('repositories should be sorted according to params', function(done){
      var test;
      request({url:'http://localhost:3001/api/search/repositories', qs:query}, function(error, response){
        test = JSON.parse(response.body);
        expect(test[0].name).toEqual('material');
        done();
      });
    });
  });

  describe('getting all tags for tagList', function(){
    it('should download tagList', function(done){
      var test;
      var tagList = {
            'n':[
                  {'value':'none','count':83}
                ],
            't':[
                  {'value':'test1','count':1},
                  {'value':'test2','count':1}
                ],
            'a':[
                  {'value':'angular','count':1}
                ],
            'j':[
                  {'value':'javascript','count':1}
                ],
            'w':[
                  {'value':'websockets','count':1}
                ]
          };
      request({url:'http://localhost:3001/api/tags'}, function(error, response){
        test = JSON.parse(response.body);
        expect(test).toEqual(tagList);
        done();
      });
    });
  });

  describe('getting all tags sorted alphabetically', function(){
    it('should download tagList', function(done){
      var test;
      var tagList = [
              {'value':'angular','count':1},
              {'value':'javascript','count':1},
              {'value':'none','count':83},
              {'value':'test1','count':1},
              {'value':'test2','count':1},
              {'value':'websockets','count':1}
            ];
      request({url:'http://localhost:3001/api/tags?sort=alphabetical'}, function(error, response){
        test = JSON.parse(response.body);
        expect(test).toEqual(tagList);
        done();
      });
    });
  });

  describe('getting all tags sorted by usages', function(){
    it('should download tagList', function(done){
      var test;
      var tagList = [
              {'value':'none','count':83},
              {'value':'websockets','count':1},
              {'value':'javascript','count':1},
              {'value':'angular','count':1},
              {'value':'test2','count':1},
              {'value':'test1','count':1}
            ];
      request({url:'http://localhost:3001/api/tags?sort=usage'}, function(error, response){
        test = JSON.parse(response.body);
        expect(test).toEqual(tagList);
        done();
      });
    });
  });

  describe('getting facets', function(){
    it('should get all facets', function(done){
      var test;
      var facets = [
              {'label':'name','category':'repository'},
              {'label':'dependency','category':'module'},
              {'label':'project','category':'module'},
              {'label':'tag','category':'module'}
            ];
      request({url:'http://localhost:3001/api/facets/all'}, function(error, response){
        test = JSON.parse(response.body);
        expect(test).toEqual(facets);
        done();
      });
    });
  });


  describe('getting values for facet - dependency', function(){
    it('should get all values', function(done){
      var test;
      var values = [
              {'label':'angular','category':'dependency'},
              {'label':'angular-resource','category':'dependency'},
              {'label':'angular-cookies','category':'dependency'},
              {'label':'angular-sanitize','category':'dependency'},
              {'label':'angular-animate','category':'dependency'},
              {'label':'angular-touch','category':'dependency'},
              {'label':'angular-route','category':'dependency'},
              {'label':'angular-ui','category':'dependency'},
              {'label':'angular-bootstrap','category':'dependency'},
              {'label':'angular-marked','category':'dependency'},
              {'label':'angular-disqus','category':'dependency'},
              {'label':'angular-mocks','category':'dependency'},
              {'label':'angular-loader','category':'dependency'},
              {'label':'bootstrap-sass-official','category':'dependency'},
              {'label':'bootstrap','category':'dependency'},
              {'label':'bootstrap-sass','category':'dependency'},
              {'label':'brick','category':'dependency'},
              {'label':'chromedriver_mac_26-0-1383-0','category':'dependency'},
              {'label':'d3','category':'dependency'},
              {'label':'es5-shim','category':'dependency'},
              {'label':'html5-boilerplate','category':'dependency'},
              {'label':'json3','category':'dependency'},
              {'label':'jquery','category':'dependency'},
              {'label':'jasmine','category':'dependency'},
              {'label':'karma','category':'dependency'},
              {'label':'lodash','category':'dependency'},
              {'label':'markdown','category':'dependency'},
              {'label':'polymer','category':'dependency'},
              {'label':'selenium-server-standalone-2-33-0','category':'dependency'},
              {'label':'ui-bootstrap','category':'dependency'}
            ];
      request({url:'http://localhost:3001/api/facets/value?facet=dependency'}, function(error, response){
        test = JSON.parse(response.body);
        expect(test).toEqual(values);
        done();
      });
    });
  });

  describe('getting values for facet - tag', function(){
    it('should get all values', function(done){
      var test;
      var values = [
          {'label':'angular','category':'tag'},
          {'label':'javascript','category':'tag'},
          {'label':'none','category':'tag'},
          {'label':'test1','category':'tag'},
          {'label':'test2','category':'tag'},
          {'label':'websockets','category':'tag'}
      ];
      request({url:'http://localhost:3001/api/facets/value?facet=tag'}, function(error, response){
        test = JSON.parse(response.body);
        expect(test).toEqual(values);
        done();
      });
    });
  });
});