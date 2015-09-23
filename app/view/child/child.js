'use strict';

angular.module('myApp.view.child', [
    'ngRoute',
    'ngTable',
    'ui.bootstrap',
    'myApp.search',
])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/child', {
                templateUrl: 'view/child/child-list.html',
                controller: 'ChildListController'
            })
            .when('/child/:pn', {
                templateUrl: 'view/child/child-details.html',
                controller: 'ChildDetailsController'
            });
    }])

    .directive('searchChild', ['$location', 'childrenManager', function($location, childrenManager) {
        return {
            restrict: 'E',
            template: '<search items="children" item-formater="childFormater" item-execute="openChild"></search>',

            link: function(scope, element, attrs) {
                childrenManager.getAll().then(function(data) {
                    scope.children = data;
                    scope.childFormater = function(child) { return (child.name+' ['+child.pn+']'); };
                    scope.openChild = function(child) {
                        $location.path("/child/" + child.pn);
                    };
                });
            },
        };
    }])


    .controller('ChildListController', ['$scope', '$location', '$log', 'ngTableParams', 'Child', 'childrenManager', function ($scope, $location, $log, ngTableParams, Child, childrenManager) {
        $scope.tableParams = new ngTableParams(
            {
                count: 25,
            },
            {
                getData: function ($defer, params) {
                    childrenManager.getAll().then(
                        function (data) {
                            $scope.items = data;
                            params.total(data.length);
                            $defer.resolve(data);
                        },
                        $log.error);
                },
            }
        );

        $scope.showChild = function (pn) {
            $location.path("/child/" + pn);
        };
    }])


    .controller('ChildDetailsController', ['$scope', '$location', '$log', '$routeParams', 'ngTableParams', 'childrenManager', 'userManager',
        function ($scope, $location, $log, $routeParams, ngTableParams, childrenManager, userManager) {

            childrenManager.get($routeParams.pn).then(function (child) {
                $scope.child = child;

                $scope.save = function () {
                    child.update();
                };

                $scope.tableFamily = new ngTableParams(
                    {
                        count: 25,
                    },
                    {
                        getData: function ($defer, params) {
                            var data = [];
                            $scope.items = data;
                            params.total(data.length);
                            $defer.resolve(data);
                        },
                    }
                );

                $scope.tableCoaching = new ngTableParams(
                    {
                        count: 25,
                    },
                    {
                        getData: function ($defer, params) {
                            var data = [];
                            $scope.items = data;
                            params.total(data.length);
                            $defer.resolve(data);
                        },
                    }
                );

                $scope.showFamilyMember = function (familyMemberId) {
                    $location.path("/child/" + pn + "/family/" + familyMemberId);
                };
            });


            userManager.getAllSocialworkers().then(function (users) {
                $scope.socialworkers = users;
            });

            $scope.centers = ['Tikiapara', 'Liluah'];

            $scope.schools = [
                //TODO: schoolManager to get list of all schools
                {name: 'St. Joseph Day School',},
                {name: 'Blooming Dale International Academy',},
            ];

        }]);
;

