'use strict';

define([], function() {
    return {
        load: function (dependencies, authCheckNeeded) {
            var definition = {
                resolver:['$q', '$rootScope', '$location', 'authService', function($q, $rootScope, $location, authService){
                    var deferred = $q.defer();
                    var modules = dependencies;
                    require(modules, function(){
                        //If this route needs authentication, validate user login
                        if(authCheckNeeded){
                            if(authService.userIsAuthenticated()){
                                $rootScope.$apply(function(){
                                   deferred.resolve();
                                });
                            }else{
                                deferred.reject();
                                $location.url('/auth?ru=' + escape($location.url()));
                            }
                        }else{
                            //If not, resolve the route
                            $rootScope.$apply(function(){
                               deferred.resolve();
                            });
                        }
                    });
                    return deferred.promise;
                }]
            };
            return definition;
        }
    }
});
