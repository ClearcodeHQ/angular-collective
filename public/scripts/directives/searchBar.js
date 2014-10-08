 'use strict';

angular.module('angularcolApp')
    .directive('searchBar', function($timeout) {
        return {
            restrict: 'C',
            scope:{query:'=', options:'=', func:'='},
            controller: function($scope, $http, $filter) {
                $scope.query = $scope.query || {};
                $scope.facets = [];
                $scope.options = $scope.options || {};
                $scope.emptyQuery = function() {
                    var empty = true;
                    if(Object.keys($scope.query).length === 0) {
                        return empty;
                    }
                    angular.forEach($scope.query, function(val, id) {
                        if(val.length > 0) {
                            empty =  false;
                        }
                    });
                    return empty;
                }
                $scope.getFacet = function() {
                    return $http.get($scope.options.getFacetsUrl);
                };

                $scope.getValues = function(facet) {
                    var url = $scope.options.getValuesUrl,
                        params = {facet:facet};
                    return $http.get(url, {params: params});
                };

                this.updateQuery = function(facet, oldVal, newVal) {
                    var valuesArray = $scope.query[facet],
                        oldIndex = valuesArray.indexOf(oldVal),
                        newIndex = valuesArray.indexOf(newVal);

                    if(oldIndex !== -1 && newIndex === -1) {
                        valuesArray[oldIndex] = newVal;
                    }
                };

                $scope.addToQuery = function(facet, val) {
                    $scope.query[facet] = $scope.query[facet] || [];
                    if($scope.query[facet].indexOf(val) === -1) {
                        $scope.query[facet].push(val);
                    }
                };

                $scope.deleteLast = function() {
                    var keys = Object.keys($scope.query),
                    i,
                    current;
                    keys = $filter('orderBy')(keys, 'toString()');
                    for(i = keys.length; i > 0; i--) {
                        current = keys[i - 1];
                        if($scope.query[current].length > 0) {
                            $scope.query[current].pop();
                            break;
                        }
                    }
                }

                this.getValues = $scope.getValues;
                this.deleteFacetValue = function(facet, value) {
                    var valueArr = $scope.query[facet],
                    index = valueArr.indexOf(value);
                    if(index !== -1) {
                        valueArr.splice(valueArr.indexOf(value), 1);
                    }
                };

                $scope.clearAndReFocus = function($scope, data, element) {
                    $scope.facets = data.data;
                    element.find('.main-input').blur();
                    element.find('.main-input').focus();
                };

                this.clearAndReFocus = $scope.clearAndReFocus;
            },
            templateUrl: '/templates/directives/searchBar.html',
            link: {
                pre: function preLink($scope, element, attr, ngmodel) {
                    $scope.getFacet().then(function(data) {
                        $scope.facets = data.data;
                    });
                    $scope.lastVal = '';
                    $scope.test = {};
                    $scope.selectedFacet = '';
                    $scope.autocompleteOptions = {
                        options: {
                            html: false,
                            focusOpen: true,
                            source: function(request, response) {
                                var list = angular.copy($scope.facets),
                                    group = {},
                                    data = [];
                                list = $scope.autocompleteOptions.methods.filter(list, request.term);
                                angular.forEach(list, function(facet) {
                                    var cat = facet.category || $scope.selectedFacet;
                                    group[cat] = group[cat] || [];
                                    group[cat].push(facet);
                                });

                                angular.forEach(group, function(value, key) {
                                    // groupLabel
                                    data.push({
                                        groupLabel: '<strong>' + key + '</strong>'
                                    });
                                    data = data.concat(value);
                                });

                                response(data);
                            }
                        },
                        methods: {},
                        events: {
                            select: function(event, ui) {
                                if(ui.item.label && ui.item.value) {
                                    if(!$scope.selectedFacet) {
                                        $scope.selectedFacet = ui.item.value;
                                        $scope.getValues($scope.selectedFacet).then(function(data) {
                                            $scope.clearAndReFocus($scope, data, element);
                                        });
                                    }
                                    else {
                                        $scope.addToQuery($scope.selectedFacet, ui.item.value);
                                        $scope.selectedFacet = '';
                                        $scope.getFacet().then(function(data) {
                                            $scope.clearAndReFocus($scope, data, element);
                                        });
                                    }
                                }
                            }
                        }

                    };
                },
                post: function postLink($scope, element, attr, ngmodel) {
                    var el = element.find('input');
                    $scope.deleteNewFacet  = function() {
                        $scope.selectedFacet = '';
                        $scope.getFacet().then(function(data) {
                            $scope.facets = data.data;
                        });
                    };
                    el.bind('keypress', function(e) {
                        var code = e.keyCode || e.which,
                        check = false;
                        $scope.$apply(function() {
                            if(code === 13 && el.val() !== '') {
                                if(!$scope.selectedFacet) {
                                    for(var k = 0, length = $scope.facets.length; k < length; k++) {
                                        if($scope.facets[k].label === el.val()) {
                                            check = true;
                                        }
                                    }
                                    if(check) {
                                        $scope.selectedFacet = el.val();
                                        $scope.getValues($scope.selectedFacet).then(function(data) {
                                            $scope.clearAndReFocus($scope, data, element);
                                        });
                                    }
                                    else {
                                        $scope.selectedFacet =  $scope.options.defaultFacet;
                                        $scope.getFacet().then(function(data) {
                                            $scope.clearAndReFocus($scope, data, element);
                                        });
                                        $scope.addToQuery($scope.selectedFacet, el.val());
                                        $scope.selectedFacet = '';
                                        $scope.test.zmienna = '';
                                        $timeout(function() {
                                            element.find('button').click();
                                        });
                                    }
                                }
                                else {
                                    $scope.getFacet().then(function(data) {
                                        $scope.clearAndReFocus($scope, data, element);
                                    });
                                    $scope.addToQuery($scope.selectedFacet, el.val());
                                    $scope.selectedFacet = '';
                                    $scope.test.zmienna = '';
                                }
                            }
                            if(code === 13 && el.val() === '') {
                                $timeout(function() {
                                    element.find('button').click();
                                });
                            }
                        });
                    });
                    el.bind('keyup', function(e) {
                        $scope.$apply(function() {
                            if(e.keyCode === 8 && el.val() === '' && $scope.lastVal.length === 0) {
                                if($scope.selectedFacet !== '') {
                                    $scope.selectedFacet = '';
                                    $scope.getFacet().then(function(data) {
                                        $scope.facets = data.data;
                                    });
                                }
                                else {
                                    $scope.deleteLast();
                                }
                            }
                            $scope.lastVal = el.val();
                        });
                    });
                    $scope.$watch('selectedFacet', function(newVal, oldVal) {
                        $scope.test.zmienna = '';
                    });
                    element.find('.glyphicon-trash').on('click', function() {
                        $scope.$apply(function() {
                            $scope.query = {};
                        });
                    });
                }
            }

        };
    })
    .directive('searchFacet', function($compile) {
        return {
            restrict: 'C',
            require: '^searchBar',
            scope:{facet:'@', value:'='},
            templateUrl: '/templates/directives/searchFacet.html',
            link: {
                pre: function preLink($scope, element, attr, ctrls) {
                    ctrls.getValues($scope.facet).then(function(data) {
                        $scope.facets = data.data;
                    });
                    $scope.autocompleteOptionss = {
                        options: {
                            html: false,
                            focusOpen: true,
                            onlySelect: false,
                            source: function(request, response) {
                                response($scope.facets);
                            }
                        },
                        methods: {},
                        events: {
                            close: function(event, ui) {
                                $scope.$apply(function() {
                                    if($scope.value === '') {
                                        $scope.value = $scope.initial;
                                    }
                                });
                            }
                        }

                    };
                    $scope.initial = $scope.value;
                },
                post: function postLink($scope, element, attr, ctrls) {
                    $scope.saveInitial = function() {
                        $scope.initial = $scope.value;
                    };
                    $scope.saveChanged = function() {
                        ctrls.updateQuery($scope.facet, $scope.initial, $scope.value);
                    };
                    var width = element.find('.hiddenSpan'),
                        i,
                        length;

                    element.find('i').on('click', function() {
                        $scope.$apply(function() {
                            ctrls.deleteFacetValue($scope.facet, $scope.value);
                        });
                    });

                    $scope.$watch('value', function() {
                        element.find('input').css('width', angular.element(width).prop('offsetWidth') + 'px');
                    });
                }
            }
        };
    });
