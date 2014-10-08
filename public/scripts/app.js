'use strict';

/**
  * @ngdoc overview
  * @name angularcolApp
  * @description
  * # angularcolApp
  *
  * Main module of the application.
  */
angular
    .module('angularcolApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.bootstrap',
        'hc.marked',
        'ngDisqus',
        'ui.autocomplete',
        'ngTagsInput',
        'ui-notification',
        'angular-loading-bar'
    ])
    .config(function($routeProvider, $locationProvider, $disqusProvider, $httpProvider) {
            //Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $disqusProvider.setShortname('angularcollective');
        $locationProvider.hashPrefix('!');
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'RepositoryCtrl',
                reloadOnSearch: false
            })
            .when('/search', {
                templateUrl: 'views/search.html',
                controller: 'RepositoryCtrl',
                reloadOnSearch: false
            })
            .when('/404', {
                templateUrl: 'views/404.html'
            })
            .when('/tagList', {
                templateUrl: 'views/tagList.html',
                controller: 'RepositoryCtrl'
            })
            .otherwise({
                templateUrl: 'views/404.html',
                controller: 'RepositoryCtrl'
            });
    });
