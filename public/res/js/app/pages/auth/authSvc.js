'use strict';

define(['serviceModule', 'common/ajax'], function (services) {

        services.service('authService', ['$http', '$q', '$rootScope', 'ajaxService',
            function ($http, $q, $rootScope, ajaxService) {
                this.userIsAuthenticated = function(){
                    return $rootScope.globals.user != null;
                };
                this.doSignup = function(params){
                    return ajaxService.triggerAjax('api/signup', params, true, null);
                };

                this.doLogin = function(params){
                    return ajaxService.triggerAjax('api/login', params, true, null);
                };

                this.getMe = function(){
                    return ajaxService.triggerAjax('api/me', {}, false, null);
                };

                this.doLogout = function(params){
                    return ajaxService.triggerAjax('api/logout', params, false, null);
                };
            }
        ]);
});
