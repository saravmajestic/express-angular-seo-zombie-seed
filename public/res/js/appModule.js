'use strict';

define([
    'appRoutes',
    'routeResolve',
    'angular',
    'angularRoute',
    'angularResource',
    'angularSanitize'
    ], function (appRoutes, routeResolve, angularRoute, angularResource, angularSanitize) {

    // Declare app level module which depends on filters, and services

    var app = angular.module('myapp', ['ngRoute', 'ngResource', 'ngSanitize']);
    app.run(['$rootScope', function($rootScope){
        
        //Global data for angular templates
        $rootScope.globals = {
            "resourceUrl" : pageConfig.resourceUrl
        };


        $rootScope.$on('$routeChangeStart', function(scope, next, current){
            console.log('Changing route from '+angular.toJson(current)+' to '+angular.toJson(next));
        });

    }]);
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

                $locationProvider.html5Mode({enabled: true,requireBase: false});

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
                            "resolve": routeResolve.load(route.dependencies)
                        });
                    });
                }

                if (appRoutes.defaultRoutePath !== undefined) { // Set the default route
                    $routeProvider.otherwise({ redirectTo: appRoutes.defaultRoutePath });
                }

    }]);

    return app;
});
