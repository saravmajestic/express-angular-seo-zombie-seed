'use strict';

define(['appModule', 'app/pages/auth/authSvc'], function (app) {

        app.controller('rootController', ['$scope', '$q', '$rootScope', '$routeParams', '$timeout', '$location', '$http','authService',
            function ($scope, $q, $rootScope, $routeParams, $timeout, $location, $http, authService) {
            	$scope.welcomeMsg = 'Hello World!!!';
	            $scope.$on('$routeChangeStart', function(scope, next, current){
	                console.log('Changing route from '+angular.toJson(current)+' to '+angular.toJson(next));
	            });

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
