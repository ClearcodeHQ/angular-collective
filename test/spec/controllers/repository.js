'use strict';

describe('Controller: RepositoryCtrl', function() {
  beforeEach(module('angularcolApp'));

  var RepositoryCtrl, Repositories, $scope, $controller, $httpBackend, $location, $routeParams, repos1;

  function createController(){

    RepositoryCtrl = $controller('RepositoryCtrl', {
      $scope: $scope,
      $location: $location,
      $routeParams: $routeParams
    });
  }

  repos1 = [
   {
     'id': 1905035,
     'name': 'Apache2Piwik',
     'owner': {
       'login': 'clearcode'
     },
     'description': ''
   },
   {
     'id': 4282788,
     'name': 'facebook-sdk',
     'owner': {
       'login': 'clearcode',
     },
     'description': 'Facebook Platform Python SDK'
   },
   {
     'id': 9344809,
     'name': 'flot',
     'owner': {
       'login': 'clearcode'
     },
     'description': 'Attractive JavaScript charts for jQuery',
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
     'description': 'nicescroll plugin for jquery - scrollbars like iphone/ipad',
     'full_name': 'clearcode/jquery.nicescroll'
   },
 ];


  beforeEach(inject(function (_$controller_, $rootScope, _$httpBackend_, _Repositories_) {
        $scope = $rootScope.$new();
        $controller = _$controller_;
        $httpBackend = _$httpBackend_;
        Repositories = _Repositories_;
        $location = jasmine.createSpyObj('$location',['path', 'search', 'url']);
        $location.search.andReturn({page:undefined,filter:undefined});
        $location.path.andReturn('/');
        $routeParams = jasmine.createSpyObj('$routeParams', ['query']);
        $routeParams.query = 'test';
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
              }
          });
      }));

  describe('Repositories - default', function(){
      beforeEach(function(){
          $httpBackend.expectGET('/auth/token').respond({});
          $httpBackend.expectGET('/api/tags').respond({});
          $httpBackend.expectGET('/api/currentuser').respond({});
          $httpBackend.expectGET('api/users/clearcode/repos?page=1&per_page=5&sort=Descending&sortBy=lowerCaseName').respond(repos1, {'Link':'<https://api.github.com/user/820216/repos?page=2&per_page=5>; rel="next", <https://api.github.com/user/820216/repos?page=3&per_page=5>; rel="last"'});
          $httpBackend.expectGET('/api/tags?sort=alphabetical').respond({});
          createController();
          $httpBackend.flush();
        });
      it('should set results to $scope.repositories.array', function(){
          expect($scope.repositories.array.length).toEqual(5);
        });
      it('should set next page to $scope.repositories.next', function(){
          expect($scope.repositories.next).toEqual('2');
        });
      it('should set last page to $scope.repositories.last', function(){
          expect($scope.repositories.last).toEqual('3');
        });
    });


    describe('loadParams - default', function(){
        beforeEach(function(){
            $httpBackend.expectGET('/auth/token').respond({});
            $httpBackend.expectGET('/api/tags').respond({});
            $httpBackend.expectGET('/api/currentuser').respond({});
            $httpBackend.expectGET('api/users/clearcode/repos?page=1&per_page=5&sort=Descending&sortBy=lowerCaseName').respond(repos1, {'Link':'<https://api.github.com/user/820216/repos?page=2&per_page=5>; rel="next", <https://api.github.com/user/820216/repos?page=3&per_page=5>; rel="last"'});
            $httpBackend.expectGET('/api/tags?sort=alphabetical').respond({});
            $location.path.andReturn('/');
            createController();
            $httpBackend.flush();
            spyOn($scope, 'getRepositories').andCallThrough();
            spyOn($scope, 'prepareData').andCallThrough();
            $scope.loadParams();
          });
        it('should set results to $scope.repositories.array', function(){
            expect($scope.repositories.array.length).toEqual(5);
          });
        it('should set next page to $scope.repositories.next', function(){
            expect($scope.repositories.next).toEqual('2');
          });
        it('should set last page to $scope.repositories.last', function(){
            expect($scope.repositories.last).toEqual('3');
          });
        it('should run getRepositories', function(){
            expect($scope.getRepositories).toHaveBeenCalled();
        });
        it('should run getRepositories with 1 undefined, A-Z, undefined parameters', function(){
          expect($scope.getRepositories).toHaveBeenCalledWith(1,'angular','A-Z','Descending',undefined,'lowerCaseName');
        });
      });

  describe('loadParams - search', function(){
      beforeEach(function(){
          $httpBackend.expectGET('/auth/token').respond({});
          $httpBackend.expectGET('/api/tags').respond({});
          $httpBackend.expectGET('/api/currentuser').respond({});
          $httpBackend.expectGET('api/search/repositories?page=1&per_page=5&q=&sort=Descending&sortBy=lowerCaseName').respond(repos1, {'Link':'<https://api.github.com/user/820216/repos?page=2&per_page=5>; rel="next", <https://api.github.com/user/820216/repos?page=3&per_page=5>; rel="last"'});
          $httpBackend.expectGET('/api/tags?sort=alphabetical').respond({});
          $location.path.andReturn('/test');
          createController();
          $httpBackend.flush();
          spyOn($scope, 'getRepositories').andCallThrough();
          spyOn($scope, 'prepareData').andCallThrough();

          $scope.loadParams();
        });
      it('should set results to $scope.repositories.array', function(){
          expect($scope.repositories.array.length).toEqual(5);
        });
      it('should set next page to $scope.repositories.next', function(){
          expect($scope.repositories.next).toEqual('2');
        });
      it('should set last page to $scope.repositories.last', function(){
          expect($scope.repositories.last).toEqual('3');
        });
      it('should run getRepositories', function(){
          expect($scope.getRepositories).toHaveBeenCalled();
      });
      it('should run getRepositories with 1 undefined, A-Z, undefined parameters', function(){
        expect($scope.getRepositories).toHaveBeenCalledWith(1, '', undefined, 'Descending', { page : undefined, filter : undefined }, 'lowerCaseName');
      });
    });

  describe('loadParams - filter or sort (the same for now)', function(){
      beforeEach(function(){
          $httpBackend.expectGET('/auth/token').respond({});
          $httpBackend.expectGET('/api/tags').respond({});    
          $httpBackend.expectGET('/api/currentuser').respond({});
          $httpBackend.expectGET('api/users/clearcode/repos?filter=Newest&page=2&per_page=5&sort=Descending&sortBy=lowerCaseName').respond(repos1, {'Link':'<https://api.github.com/user/820216/repos?page=1&per_page=5>; rel="first", <https://api.github.com/user/820216/repos?page=1&per_page=5>; rel="prev", <https://api.github.com/user/820216/repos?page=3&per_page=5>; rel="next", <https://api.github.com/user/820216/repos?page=4&per_page=5>; rel="last"'});
          $location.path.andCallFake(function(){
            return '/';
          });
          $location.search.andCallFake(function(){
            return {page:2,filter:'Newest'};
          });
          createController();
          $httpBackend.expectGET('/api/tags?sort=alphabetical').respond({});
          $httpBackend.flush();
          spyOn($scope, 'getRepositories').andCallThrough();
          spyOn($scope, 'prepareData').andCallThrough();
          $scope.loadParams();

        });
      it('should set results to $scope.repositories.array', function(){
          expect($scope.repositories.array.length).toEqual(5);
        });
      it('should set next page to $scope.repositories.next', function(){
          expect($scope.repositories.next).toEqual('3');
        });
      it('should set last page to $scope.repositories.last', function(){
          expect($scope.repositories.last).toEqual('4');
        });
      it('should set first page to $scope.repositories.next', function(){
          expect($scope.repositories.prev).toEqual('1');
        });
      it('should set prev page to $scope.repositories.last', function(){
          expect($scope.repositories.first).toEqual('1');
        });
      it('should run getRepositories', function(){
          expect($scope.getRepositories).toHaveBeenCalled();
      });
      it('should run getRepositories with 2 undefined, Newest, undefined parameters', function(){
        expect($scope.getRepositories).toHaveBeenCalledWith( 2, 'angular', 'Newest', 'Descending', undefined, 'lowerCaseName');
      });
    });

  describe('getRepositoryDetails and getFallBack', function(){
    beforeEach(function(){
      $httpBackend.expectGET('/auth/token').respond({});
      $httpBackend.expectGET('/api/tags').respond({});
      $httpBackend.expectGET('/api/currentuser').respond({});
        $httpBackend.expectGET('api/users/clearcode/repos?page=1&per_page=5&sort=Descending&sortBy=lowerCaseName').respond(repos1, {'Link':'<https://api.github.com/user/820216/repos?page=1&per_page=5>; rel="first", <https://api.github.com/user/820216/repos?page=1&per_page=5>; rel="prev", <https://api.github.com/user/820216/repos?page=3&per_page=5>; rel="next", <https://api.github.com/user/820216/repos?page=4&per_page=5>; rel="last"'});
        $httpBackend.expectGET('/api/tags?sort=alphabetical').respond({});
        createController();
        spyOn($scope, 'openModal').andCallThrough();
        spyOn(Repositories, 'getFallbackRepo').andCallThrough();
        $httpBackend.flush();


      });

      it('should load data for repository details view', function(){
        $httpBackend.expectGET('api/repos/clearcode/jquery.nicescroll/readme').respond({});
        $httpBackend.expectGET('api/repos/clearcode/jquery.nicescroll/bower.json').respond({});
        $httpBackend.expectGET('/templates/directives/moduleSpec.html').respond({});
        $scope.getRepositoryDetails('clearcode/jquery.nicescroll');
        $httpBackend.flush();
        expect($scope.openModal).toHaveBeenCalled();

      });

      it('should run getFallbackRepo when details not downloaded', function(){
        $httpBackend.expectGET('api/search/repositories?q=test+in:name+user:clearcode').respond([{
          'id': 4282788,
          'name': 'facebook-sdk',
          'owner': {
            'login': 'clearcode',
          },
          'description': 'Facebook Platform Python SDK'
        }]);
        $httpBackend.expectGET('api/repos/clearcode/test/readme').respond('tests');
        $httpBackend.expectGET('api/repos/clearcode/test/bower.json').respond('tests');
        $httpBackend.expectGET('/templates/directives/moduleSpec.html').respond({});
        $scope.getRepositoryDetails('clearcode/test');
        $httpBackend.flush();
        expect(Repositories.getFallbackRepo).toHaveBeenCalled();
      });

      it('should run getFallbackRepo with clearcode/test when repo is not avaible', function(){
          $scope.getRepositoryDetails('clearcode/test');
          expect(Repositories.getFallbackRepo).toHaveBeenCalledWith('test','clearcode');
      });

  });

});
