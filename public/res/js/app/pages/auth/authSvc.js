'use strict';

define(['appModule', 'common/ajax'], function (app) {

        app.service('authService', ['$http', '$q', '$rootScope', 'ajaxService',
            function ($http, $q, $rootScope, ajaxService) {
                this.doSignup = function(params){
                    return ajaxService.triggerAjax('api/signup', params, true, null);
                };

                this.doLogin = function(params){
                    return ajaxService.triggerAjax('api/login', params, true, null);
                };

                this.getMe = function(params){
                    return ajaxService.triggerAjax('api/me', params, false, null);
                };

                this.doLogout = function(params){
                    return ajaxService.triggerAjax('api/logout', params, false, null);
                };
            }
        ]);
});
