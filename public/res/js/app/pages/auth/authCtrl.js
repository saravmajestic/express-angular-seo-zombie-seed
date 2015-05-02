'use strict';

define(['appModule','lib/hello.min', 'app/pages/auth/authSvc', 'css!./auth'], function (app) {

        app.controller('authController', ['$scope', '$q', '$rootScope', 'config', '$routeParams', '$timeout', '$location', '$http','authService',
            function ($scope, $q, $rootScope, config, $routeParams, $timeout, $location, $http, authService) {
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
                      $scope.showPageLoading("Please wait...");
					authService.doLogin($scope.loginData).then(function(resp){
                    		$scope.afterAuth(resp);
                    	}, $scope.showErrorMsg);
                    };
                    $scope.afterAuth = function(resp){
                      $scope.hidePageLoading();
                      $rootScope.$broadcast('user_login',{data : resp.user});
                              $timeout(function(){$location.url('/');},200);
                    };
                    $scope.doSignup = function(){
                      $scope.showPageLoading("Please wait...");
                    	authService.doSignup($scope.signupData).then(function(resp){
                    		$scope.afterAuth(resp);
                    	}, $scope.showErrorMsg);
                    };

                    $scope.onLoginPageLoad = function(){
                    	hello.init({ 
							facebook : config.social.facebook,
							linkedin  : config.social.linkedin,
							google   : config.social.google
						},{
							redirect_uri: $rootScope.globals.ctxUrl + 'oauth',
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
                  for(prop in $scope.signupData){
                    $scope.signupData[prop] = me[prop];
                  }
                                             $scope.signupData.uid = me.id;
                                             $scope.signupData.provider = provider;
                                             $scope.doSignup();
								});
							});
                    	});
                    	
                    }
            }
        ]);
});
