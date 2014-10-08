'use strict';

angular.module('angularcolApp')
    .directive('module', ['$location', function($location) {
        return {
            restrict: 'C',
            scope: {repo: '=', detailsClick: '&', query: '=', vote: '=', user: '=', checkDemo: '&'},
            templateUrl: '/templates/directives/module.html',
            link: function postLink($scope, element, attr, ctrls) {
                $scope.searchTag = function(tag) {
                    var queryVal = {tag: tag};
                    $location.path('/search');
                    $location.search(queryVal);
                }
            }
        };
    }]);
