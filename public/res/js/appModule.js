'use strict';

define([
    'appRoutes',
    'appConfig',
    'routeResolve',
    'angular',
    'angularRoute',
    'angularResource',
    'angularSanitize',
    'controllerModule',
    'serviceModule',
    'app/pages/header/headerCtrl'
    ], function (appRoutes, appConfig, routeResolve, angularRoute, angularResource, angularSanitize, controllerModule, serviceModule) {

    // Declare app level module which depends on filters, and services

    var app = angular.module('myapp', ['ngRoute', 'ngResource', 'ngSanitize', 'myapp.controllers', 'myapp.services']);
    app.run(['$rootScope', '$location', function($rootScope, $location){
        //Global data for angular templates
        var port = $location.port();
        var ctxUrl = $location.protocol() + '://' + $location.host()  + ( port && (port == 80 || port == 443) ? '' : ':'+port ) + "/";
        
        $rootScope.globals = {
            "resourceUrl" : pageConfig.resourceUrl,
            'ctxUrl' : ctxUrl,
            "user" : pageConfig.user
        };

        //Method to update page meta
        $rootScope.page = {
          setMeta: function(meta) {
            var rootMeta = $rootScope.meta;
            if(rootMeta && meta){
              angular.extend(rootMeta, meta);
            }else{
              rootMeta = meta;
            }

            $rootScope.meta = rootMeta;
          }
        }

        $rootScope.$on('$routeChangeStart', function(scope, next, current){
            console.log('Changing route from '+angular.toJson(current)+' to '+angular.toJson(next));
            if(next){
              console.log(next.$$route.meta);
              $rootScope.page.setMeta(next.$$route.meta);
            }
        });
        $rootScope.$on('$locationChangeStart', function(scope, next, current){
            console.log('Changing location from '+(current)+' to '+(next));
        });
    }]);
    
    app.value('config', appConfig);
        
    //Handle uncaught errors in app
    app.factory('$exceptionHandler', function() {
      return function(exception, cause) {
        if(cause){
            exception.message += ' (caused by "' + cause + '")';
        }
        alert(exception.message);
        console.log(exception, exception.stack);
      };
    });

    app.config(['$routeProvider', '$locationProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$httpProvider',
            function($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider) {

                $locationProvider.html5Mode({enabled: true,requireBase: true});

                app.controller = $controllerProvider.register;
                app.directive = $compileProvider.directive;
                app.filter = $filterProvider.register;
                app.factory = $provide.factory;
                app.service = $provide.service;

                //Define routes - controllers will be loaded dynamically
                if(appRoutes.routes !== undefined) {
                    angular.forEach(appRoutes.routes, function(route, path) {
                        $routeProvider.when(path, {
                            "templateUrl": route.templateUrl,
                            "resolve": routeResolve.load(route.dependencies, route.authCheck),
                            "meta" : route.meta
                        });
                    });
                }

                if (appRoutes.defaultRoutePath !== undefined) { // Set the default route
                    $routeProvider.otherwise({ redirectTo: appRoutes.defaultRoutePath });
                }

    }]);
	app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push(['$q', function($q) {
          return {
           'request': function(config) {
               if(config.url && config.url.indexOf('/res/') == 0){
                config.url = config.url.replace('.html', '.html'+ '?v=' + pageConfig.rv);
               }
               return config;
            },

            'response': function(response) {
               return response;
            }
          };
        }]);
    }]);
    return app;
});
