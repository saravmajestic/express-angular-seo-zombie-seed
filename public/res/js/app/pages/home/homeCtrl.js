'use strict';

define(['appModule'], function (app) {

        app.controller('homeController', ['$scope', '$q', '$rootScope', '$routeParams', '$location', '$http',
            function ($scope, $q, $rootScope, $routeParams, $location, $http) {
                    $scope.welcomeMessage = 'Welcome World';

                    $rootScope.page.setMeta({title : "Dynamic title from controller"});
            }
        ]);
});
