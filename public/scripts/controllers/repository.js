'use strict';

/**
 * @ngdoc function
 * @name angularcolApp.controller:repositoryCtrl
 * @description
 * # RepoCtrl
 * Controller of the angularcolApp for repositories
 */

angular.module('angularcolApp').controller('RepositoryCtrl', [
    '$scope', 'Repositories', 'Notification', '$location', '$window', '$routeParams', '$modal', '$q',
    function($scope, Repositories, Notification, $location, $window, $routeParams, $modal, $q) {
        $scope.repositories = {};
        $scope.repositories.test = '';
        $scope.repositories.options = {
            getFacetsUrl: 'api/facets/all',
            getValuesUrl: 'api/facets/value',
            defaultFacet: 'name'
        };
        $scope.repositories.query = {};
        $scope.tabs = [
            {title:'Newest', label:'glyphicon glyphicon-time'},
            {title:'A-Z', label:'glyphicon glyphicon-arrow-down'},
            {title:'Likes', label:'glyphicon glyphicon-thumbs-up'},
            {title:'ClearCode', label:'ficon-cc'},
            {title:'Others'},
            {title:'Directives'},
            {title:'Services'},
            {title:'Filters'}
        ];

        $scope.repositories.sortOptions = [
            {value: 'lowerCaseName', text: 'A-Z'},
            {value: 'updated_at', text: 'Modified'},
            {value: 'voteSum', text: 'Likes'}
        ];

        $scope.repositories.sortTagOptions = [
            {value: 'alphabetical', text: 'A-Z'},
            {value: 'usage', text: 'Usage'}
        ];

        $scope.repositories.searchTagByName = function(tag) {
            var queryVal = {tag: tag};
            $location.path('/search');
            $location.search(queryVal);
        };
        $scope.vote = function(repo, vote) {
            Repositories.voteForRepo(repo.id, vote)
                .success(function(data, status) {
                    var i,
                        length,
                        current;
                    repo.voteSum = data.voteSum;
                    repo.userVote = data.userVote;
                    Notification.success('Successfully voted!');
                })
                .error(function(data, status) {
                    if(status === 418) {
                        Notification.error('You already voted that way!');
                    }
                    else{
                        Notification.error('There was some error in voting, try again later!');
                    }
                });
        };

        $scope.repositories.sortTags = '';

      /**
       * Modal window instance controller + modal window functions - as in example
       * http://angular-ui.github.io/bootstrap/
       */
        var ModalInstanceCtrl = function($scope, $filter, $q, $modalInstance, repo, tagList,
                projectList, saveChanges, user, vote) {
            var addedProjects,
            getList,
            removedProjects;
            $scope.repo = repo;
            $scope.user = user;
            $scope.vote = vote;
            $scope.isAdmin = user._json ? user._json.login === 'clearcodeangularjs' : false;
            $scope.editing = false;
            // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
            $scope.editedTags = angular.copy(repo.bower_json.keywords);
            // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

            $scope.editedProjects = repo.projects.map(function(v) {
                return {text: v.name};
            });

            $scope.tagList = function(query) {
                var deferred = $q.defer(),
                data;
                data = $filter('filter')(tagList.data, query).map(function(v) {
                    return {text: v.value};
                });
                deferred.resolve(data);
                return deferred.promise;
            };

            $scope.projectList = function(query) {
                var deferred = $q.defer(),
                data;
                data = $filter('filter')(projectList.data, query).map(function(v) {
                    return {text: v.label};
                });
                deferred.resolve(data);
                return deferred.promise;
            };

            $scope.addProject = function(tag) {
                addedProjects.push(tag.text);
            };

            $scope.removeProject = function(tag) {
                console.log(tag);
                var index = addedProjects.indexOf(tag.text);
                if(index !== -1) {
                    addedProjects.splice(index, 1);
                }
                else{
                    removedProjects.push(tag.text);
                }
            };
            $scope.edit = function() {
                $scope.editing = true;
                addedProjects = [];
                removedProjects = [];
            }
            $scope.save = function() {
                var i,
                    length,
                    tagArray = [],
                    projArray = [];
                for(i = 0, length = $scope.editedTags.length; i < length; i++) {
                    tagArray.push($scope.editedTags[i].text);
                }
            // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

                $scope.repo.bower_json.keywords = angular.copy(tagArray);
            // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

                $scope.repo.addedProjects = addedProjects;
                $scope.repo.removedProjects = removedProjects;
                saveChanges($scope.repo);
                repo.projects = $scope.editedProjects.map(function(v) {
                    return {name: v.text};
                });
                $scope.editing = false;
            };
            // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
            $location.search('details', repo.full_name);
            // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
                $scope.editing = false;
                $location.search('details', null);
            };
            $scope.searchTag = function(tag) {
                var queryVal = {tag: tag};
                $scope.cancel();
                $location.path('/search');
                $location.search(queryVal);
            };

            $scope.checkDemo = function() {
            // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                var reg = /(plnkr\.co|jsfiddle\.net|jsbin\.com|github\.io)/;
                if(repo.bower_json.homepage  && reg.test(repo.bower_json.homepage)) {
            // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
                    return true;
                }
                return false;
            };
            $scope.searchProject = function(project) {
                console.log('test');
                var queryVal = {project: project};
                $scope.cancel();
                $location.path('/search');
                $location.search(queryVal);
            };
        };

        $scope.saveChanges = function(repo) {
            Repositories.updateRepo(repo);
        }

        $scope.open = function(size) {
            var modalInstance = $modal.open({
                templateUrl: '/templates/directives/moduleSpec.html',
                controller: ModalInstanceCtrl,
                size: size,
                resolve: {
                    repo: function() {
                        return $scope.repo;
                    },
                    tagList: function() {
                        return Repositories.getTags('alphabetical');
                    },
                    saveChanges: function() {
                        return $scope.saveChanges;
                    },
                    projectList: function() {
                        return Repositories.getProjects();
                    },
                    user: function() {
                        return $scope.user;
                    },
                    vote: function() {
                        return $scope.vote;
                    }
                }
            });

            modalInstance.result.then(
            angular.noop,
                function() {
                    $location.search('details', null);
                }
                );
        };

        $scope.openModal = function(repo) {
            $scope.repo = repo || {};
            $scope.open('lg');
        };

      /**
       * Repositories functions part
       */

        $scope.checkSort = function(sort, sortList) {
            var safe = false;
            angular.forEach(sortList, function(value, id) {
                if(value.value === sort) {
                    safe = true;
                }
            });
            return safe;
        };

      /**
       * function that connects to repo service, gets all data and prepare pagination object
       * @param {number} page - number of page to download
       * @param {string} filter - filter for repo - when backend will be completed
       * @param {string} sort - sort data
       * @param {string} query - search query (merged two functionalities,
       * one for simple getting data, one for searching in repo)
       */
        $scope.getRepositories = function(page, user, filter, sort, query, sortBy) {
            if(angular.isUndefined(query)) {
                Repositories.getRepositories(page, user, filter, sort, sortBy).then(function(data) {
                    $scope.repositories.last = 0;
                    $scope.repositories.next = 0;
                    $scope.prepareData(data, page);
                });
          }
            else{
                Repositories.searchRepositories(page, query, user, sort, sortBy).then(function(data) {
                    $scope.repositories.last = 0;
                    $scope.repositories.next = 0;
                    $scope.prepareData(data, page);
                });
            }
        };

      /**
       * Gets single repository object by id (from downloaded eariler array)
       */

        $scope.getRepositoryDetails = function(id) {
            var repo,
                user = id.split('/')[0],
                name = id.split('/')[1],
                readmeFallback,
                setReadme,
                dependeciesFallback,
                setDependencies;
            readmeFallback = function() {
                repo.readme = 'No readme in this module';
                return Repositories.getBowerJsonForRepo(user, name);
            };

            setReadme = function(data) {
                repo.readme = data.data;
                return Repositories.getBowerJsonForRepo(user, name);
            };

            dependeciesFallback = function() {
                repo.bower = {license:'None provided', dependencies:{'No dependencies':''}};
                $scope.openModal(repo);
            };

            setDependencies = function(data) {
                repo.bower = data.data;
                $scope.openModal(repo);
            };

            angular.forEach($scope.repositories.array, function(value) {
            // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                if(value.full_name === decodeURI(id)) {
            // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
                    repo =  value;
                }
            });

            if(!repo) {
                Repositories.getFallbackRepo(name, user)
            .then(function(data) {
                repo = data.data;
                return Repositories.getReadmeForRepo(user, name);
            })
            .then(setReadme, readmeFallback)
            .then(setDependencies, dependeciesFallback);
          }
            else{
                Repositories.getReadmeForRepo(user, name)
                    .then(setReadme, readmeFallback)
                    .then(setDependencies, dependeciesFallback);
            }
        };

        $scope.repositories.enableSort = true;
        $scope.repositories.email = '';
        $scope.repositories.addToNewsletter = function() {
            if($scope.repositories.email) {
                Repositories.addToNewsletter($scope.repositories.email)
                    .error(function() {
                        Notification.error('There was some error in subscribing, try again later!');
                    })
                    .success(function() {
                        Notification.success('Successfully subscribed to newsletter!');
                    });
            };
            $scope.repositories.email = '';
        }

        $scope.getCurrentUser = function() {
            Repositories.getCurrentUser().then(function(data) {
                $scope.user = data.data;
            });
        };

        $scope.repositories.checkDemo = function(repo) {
             // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
            var reg = /(plnkr\.co|jsfiddle\.net|jsbin\.com|github\.io)/;
            if(repo.bower_json.homepage  && reg.test(repo.bower_json.homepage)) {
            // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
                return true;
            }
            return false;
        };

        $scope.getTags = function(sort) {
            Repositories.getTags(sort).then(function(data) {
                $scope.repositories.tags = data.data;
            });
        };
      /**
       *  Prepares downloaded data for usage in repositories list, additionaly shows modal window when needed
       * (when we have details variable in link  http://localhost:9000/#/?details=1905035)
       */

        $scope.prepareData = function(data, page) {
            var link = data.headers().link,
                reg = /[\?&]page=(\d+).*?&per_page=(\d+).*? rel=\"(.*?)\"/g,
                match;
            $scope.repositories.array = data.data;
            while((match = reg.exec(link)) !== null) {
                $scope.repositories[match[match.length - 1 ]] = match[1];
            }
            reg.lastIndex = 0; // resets regexp index
            $scope.repositories.perPage = $scope.repositories.array.length;
            $scope.repositories.maxPages = ($scope.repositories.last || $scope.repositories.next || page);
            $scope.repositories.totalItems = $scope.repositories.maxPages * $scope.repositories.perPage;
            $scope.repositories.currentPage = page;
            if($location.search().details) {
                $scope.getRepositoryDetails($location.search().details);
            }
        };

      /**
       * Load on init first page or page in $location.search object init function
       */
        $scope.loadParams = function() {
            var page  = parseInt($location.search().page, 10) || 1,
                sort = $location.search().sort,
                sortBy = $location.search().sortBy,
                searchName = $location.search().name,
                searchDep = $location.search().dependency,
                searchProj = $location.search().project,
                searchTag = $location.search().tag,
                filter;
            if(sort !== 'Ascending') {
                sort = 'Descending';
            }
            if($scope.checkSort(sortBy, $scope.repositories.sortOptions) !== true) {
                sortBy = 'lowerCaseName';
            }
            $scope.repositories.sortBy = sortBy;
            $scope.repositories.sort = (sort === 'Ascending');
            if($location.path() === '/') {
                filter =  $location.search().filter || 'A-Z' ;
                $scope.repositories.filter = filter;
                if(filter === 'Newest' || filter === 'A-Z' || filter === 'Likes') {
                    $scope.repositories.enableSort = false;
                }
                else{
                    $scope.repositories.enableSort = true;
                }
                angular.forEach($scope.tabs, function(value) {
                    value.active = (value.title === filter);
                });
                $scope.getRepositories(page, 'clearcodeangularjs', filter, sort, undefined, sortBy);
            }
            else{
                if(searchName) {
                    $scope.repositories.query.name  = searchName.split(',');
                }
                if(searchDep) {
                    $scope.repositories.query.dependency = searchDep.split(',');
                }
                if(searchProj) {
                    $scope.repositories.query.project = searchProj.split(',');
                }
                if(searchTag) {
                    $scope.repositories.query.tag = searchTag.split(',');
                }
                $scope.getRepositories(page, '', undefined , sort, $location.search(), sortBy);
            }
            if($location.path() === '/tagList') {
                $scope.repositories.sortTags = '';
            }
            else {
                $scope.repositories.sortTags = 'alphabetical';
            }
        };
        $scope.getTags();
        $scope.getCurrentUser();
        $scope.loadParams();

      /**
       * Listener for changes in route
       */

        $scope.$on('$routeUpdate', function() {
            $scope.loadParams();
        });

        $scope.$watch('repositories.sort', function() {
            var sortVal = $scope.repositories.sort ? 'Ascending' : 'Descending';
            $location.search('sort', sortVal);
        });

        $scope.$watch('repositories.sortBy', function() {
            $location.search('sortBy', $scope.repositories.sortBy);
        });

        $scope.$watch('repositories.sortTags', function() {
            $scope.getTags($scope.repositories.sortTags);
        });

      /**
       * Route setters (filter, details, page, search)
       */
        $scope.repositories.changeFilter = function(filter) {
            if(($scope.repositories.filter !== filter) && $location.path() === '/') {
                $location.search('filter', filter);
                $scope.repositories.filter = filter;
                $scope.repositories.currentPage = 1;
                $location.search('page', $scope.repositories.currentPage);
                $window.scrollTo(0, 0);
            }
        };

        $scope.setDetails = function(id) {
            $location.search('details', id);
        };

        $scope.repositories.pageChanged = function() {
            $location.search('page', $scope.repositories.currentPage);
            $window.scrollTo(0, 0);
        };

        $scope.search = function(query) {
            var queryVal = {};
            angular.forEach(query, function(val, id) {
                queryVal[id] = val.toString();
            });
            $location.path('/search');
            $location.search(queryVal);
        };

      /**
       * function for getting README file for repository (written in markup)
       * @param {string} repo repository name
       */
        $scope.getReadme = function(user, repo) {
            Repositories.getReadmeForRepo(user, repo).then(function(data) {
                $scope.repoReadme = data;
            });
        };

      /**
       * function for getting bowerjson for repository
       * @param {string} repo repository name
       */

        $scope.getBowerJson = function(user, repo) {
            Repositories.getBowerJsonForRepo(user, repo).then(function(data) {
                $scope.repoBowerJson = data;
            });
        };

        $scope.login = function() {
            $window.location = '/auth/signin';
        };

        $scope.logout = function() {
            Repositories.clearToken();
            $window.location = '/auth/signout';
        };
    }
]);
