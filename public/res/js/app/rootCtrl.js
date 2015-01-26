'use strict';

define(['appModule', 'app/pages/auth/authSvc'], function (app) {

        app.controller('rootController', ['$scope', '$q', '$rootScope', '$routeParams', '$timeout', '$location', '$http','authService',
            function ($scope, $q, $rootScope, $routeParams, $timeout, $location, $http, authService) {
            	$scope.welcomeMsg = 'Hello World!!!';
	            $scope.onSiteLoad = function(){
	                authService.getMe().then(function(resp){
	                    console.log(resp);
	                }, function(err){
	                    console.log(err);
	                });
	            };

	            $scope.logout = function(){
	            	authService.doLogout().then(function(resp){
	                    console.log(resp);
	                }, function(err){
	                    console.log(err);
	                });
	            }        
            }
        ]);
});
