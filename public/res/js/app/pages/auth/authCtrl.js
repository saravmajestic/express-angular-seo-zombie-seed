'use strict';

define(['appModule','lib/hello.min', 'app/pages/auth/authSvc'], function (app) {

        app.controller('authController', ['$scope', '$q', '$rootScope', '$routeParams', '$timeout', '$location', '$http','authService',
            function ($scope, $q, $rootScope, $routeParams, $timeout, $location, $http, authService) {
                    $scope.welcomeMessage = 'Welcome to Login page!!!';

                    $scope.user = null;

                    $scope.signupData = {
                    	email : "",
                    	password : "",
                    	firstname : ""
                    };
                    $scope.loginData = {
                    	email : "",
                    	password : ""
                    };
                    $scope.dologin = function(){
						authService.doLogin($scope.loginData).then(function(resp){
                    		console.log(resp);
                    	}, function(err){
                    		console.log(err);
                    	});
                    };
                    $scope.doSignup = function(){
                    	authService.doSignup($scope.signupData).then(function(resp){
                    		console.log(resp);
                    	}, function(err){
                    		console.log(err);
                    	});
                    };

                    $scope.onLoginPageLoad = function(){
                    	hello.init({ 
							facebook : 287778054690335,
							linkedin  : "",
							google   : ""
						},{
							redirect_uri:'http://192.168.1.37:8080/oauth',
							scope : ['friends', 'email']
						});
					}
					$scope.onLoginPageLoad();

                    $scope.doLogin = function(network, provider){
                    	var t = $scope;
                    	hello(network).login(function(r){
                    		if(!r.authResponse || (r.authResponse && !r.authResponse.access_token)){
                    			alert("Something wrong!");
                    			return false;
                    		}
                    		
                    		// call user information, for the given network
							hello(network).api( '/me' ).then( function(me){
								console.log(me);
								$scope.$apply(function(){
									$scope.user = me;
								});
							});
                    	});
                    	
                    }
            }
        ]);
});
