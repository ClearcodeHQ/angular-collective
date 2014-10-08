'use strict';
angular.module('angularcolApp')
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push(['$rootScope', '$q', 'userToken', function($rootScope, $q, userToken) {
            return {
                request: function(r) {
                    if(userToken.token) {
                        r.headers.Authorization = 'token ' + userToken.token;
                    }
                    return r || $q.when(r);
                }
            };
        }]);
    }]);
