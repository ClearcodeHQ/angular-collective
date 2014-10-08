'use strict';

angular.module('angularcolApp')
    .directive('search', function() {
        return {
            restrict: 'C',
            scope: {func: '='},
            template: '<input ng-model="query"><button class="searchButton" ng-click="func(query)">' +
              '<span class="glyphicon glyphicon-search"></span></button>',
            link: function postLink($scope, element, attr, ctrls) {
                element.bind('keydown keypress', function(event) {
                    if(event.which === 13) {
                        $scope.$apply(function() {
                            $scope.func($scope.query);
                        });

                        event.preventDefault();
                    }
                });
            }
        };
    });
