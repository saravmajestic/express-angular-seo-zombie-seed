'use strict';

define(['appModule'], function (app) {

        app.controller('authController', ['$scope', '$q', '$rootScope', '$routeParams', '$location', '$http',
            function ($scope, $q, $rootScope, $routeParams, $location, $http) {
                    $scope.welcomeMessage = 'Welcome to Login page!!!';
            }
        ]);
});
