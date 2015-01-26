'use strict';

define(['appModule','lib/hello.min', 'app/pages/auth/authSvc', 'css!./auth', 'css!cssPath/app/home'], function (app) {

        app.controller('authController', ['$scope', '$q', '$rootScope', '$routeParams', '$timeout', '$location', '$http','authService',
            function ($scope, $q, $rootScope, $routeParams, $timeout, $location, $http, authService) {
                    $scope.welcomeMessage = 'Welcome to Login page!!!';

                    $scope.user = null;

                    $scope.signupData = {
                    	email : "",
                    	password : "",
                    	first_name : "",
                         last_name : "",
                         uid : null,
                         birthday : null,
                         gender : null,
                         picture : null,
                         provider : 'C'
                    };
                    $scope.loginData = {
                    	email : "",
                    	password : ""
                    };
                    $scope.dologin = function(){
					authService.doLogin($scope.loginData).then(function(resp){
                    		$rootScope.$broadcast('user_login',{data : resp.user});
                              $timeout(function(){$location.url('/');},200);
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
							redirect_uri:'http://192.168.1.36:8080/oauth',
							scope : ['friends', 'email']
						});
					}
					$scope.onLoginPageLoad();

                    $scope.doSocialLogin = function(network, provider){
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
									angular.extend($scope.signupData, me);
                                             $scope.signupData.uid = $scope.signupData.id;
                                             $scope.signupData.provider = provider;
                                             $scope.doSignup(); 
								});
							});
                    	});
                    	
                    }
            }
        ]);
});
