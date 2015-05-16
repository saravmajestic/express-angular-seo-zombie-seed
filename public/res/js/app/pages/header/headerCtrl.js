'use strict';

define(['controllerModule', 'app/pages/auth/authSvc'], function (controllers) {

        controllers.controller('headerController', ['$scope', '$q', '$rootScope', '$routeParams', '$timeout', '$location', '$http','authService', 'config',
            function ($scope, $q, $rootScope, $routeParams, $timeout, $location, $http, authService, config) {
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
	                    $location.url('/');
	                }, function(err){
	                    console.log(err);
	                });
	            };
	            
	            $scope.spinner = {
            		show : false,
            		message : null
            	};
				$scope.hidePageLoading = function(){
					$scope.spinner.show = false;
				};
				$scope.showPageLoading = function(message){
					$scope.spinner = {
	            		show : true,
	            		message : (message || 'Loading...')
	            	};
				};

				$scope.status = {
					showStatus : false,
					type : null,
					message : null
			 	};
				$scope.showActionStatus = function(type, message, customDelay){
					var messageClass = (type == "R") ? "alert-danger" : "alert-success";
					
					$scope.status.showStatus = true;
					$scope.status.type = messageClass;
					$scope.status.message = message;

				 	var delay = customDelay || 6000;
					$timeout(function(){
						$scope.status.showStatus = false;
					},delay);
				}; 
				$scope.showErrorMsg = function(err){
					var message = config.applicationErrorMsg;
					if(err && err.errMsg){
						message = err.errMsg;
					}
					$scope.isLoading = false;
					$scope.showActionStatus("R", message);
					$scope.hidePageLoading();
				};       
            }
        ]);
});