'use strict';
define(['appModule'], function(app) {
    var convertAjaxParams = function(obj) {
        var query = '',
            name, value, fullSubName, subName, subValue, innerObj, i;
        for (name in obj) {
            value = obj[name];
            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += convertAjaxParams(innerObj) + '&';
                }
            } else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += convertAjaxParams(innerObj) + '&';
                }
            } else if (value !== undefined && value !== null) query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
        return query.length ? query.substr(0, query.length - 1) : query;
    };
    app.service('ajaxService', ['$q','$http', '$rootScope', '$window', function($q, $http, $rootScope, $window){

    this.triggerAjax = function(url, query, isPost, cache) {
        var deferred = $q.defer(),
            start = new Date().getTime();
        if (!query) {
            query = {};
        }
        query["r"] = Math.random();
        console.log(url, query);
        var random = Math.floor(Math.random() * (1000));
        var successMethodName = "successMethod" + random;
        $window[successMethodName] = function(resp) {
            var timeTaken = ((new Date().getTime()) - start);
            console.log("Time taken for " + url + ": " + timeTaken);
            if (resp.isSuccess) {
                deferred.resolve(resp);
            } else {
                failedMethod(resp);
            }
        };
        var failedMethod = function(err) {
            $rootScope.$broadcast('ajax_failed', {
                "data": err
            });
            deferred.reject(err);
        };
        
        var ctx = "http://192.168.1.37:8080/";
        if (isPost) {
            $http({
                method: 'POST',
                data: query,
                url: ctx + url,
                cache: cache,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                transformRequest: [function(data) {
                    return angular.isObject(data) && String(data) !== '[object File]' ? convertAjaxParams(data) : data;
                }]
            })
            .success($window[successMethodName])
            .error(failedMethod);
        } else {
            var httpType = "GET";
            var finalUrl = (ctx + url);
            
            $http({
                url: (ctx + url),
                method: 'GET',
                params: query,
                cache: cache,
            })
            .success($window[successMethodName])
            .error(failedMethod);
        }
        return deferred.promise;
    };
    }]);
});