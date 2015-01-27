'use strict';

define(['controllerModule', 'app/pages/auth/authSvc'], function (controllers) {

        controllers.controller('headerController', ['$scope', '$q', '$rootScope', '$routeParams', '$timeout', '$location', '$http','authService',
            function ($scope, $q, $rootScope, $routeParams, $timeout, $location, $http, authService) {
            	$rootScope.$on('user_login', function(e, data){
            		$scope.getMe();
            	});
            	$scope.onAppLoad = function(){
	             	$scope.getMe();   
	            };
	            $scope.getMe = function(){
	            	authService.getMe().then(function(resp){
	            		console.log(resp);
	                    $rootScope.globals.user = resp.user;
	                }, function(err){
	                    console.log(err);
	                });
	            };
	            $scope.logout = function(){
	            	authService.doLogout().then(function(resp){
	                    $rootScope.globals.user = null;
	                }, function(err){
	                    console.log(err);
	                });
	            }        
            }
        ]);
});