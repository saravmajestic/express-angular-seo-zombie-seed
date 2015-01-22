'use strict';

define([], function() {
    return {
        load: function (dependencies) {
            var definition = {
                resolver:['$q', '$rootScope', function($q, $rootScope){
                    var deferred = $q.defer();
                    var modules = dependencies;
                    require(modules, function(){
                        $rootScope.$apply(function(){
                           deferred.resolve();
                        });
                    });
                    return deferred.promise;
                }]
            };
            return definition;
        }
    }
});
