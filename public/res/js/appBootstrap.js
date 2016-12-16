'use strict';
//For old IE browsers and in prod suppress all console logs
if(pageConfig.env == 'production' || typeof console == 'undefined'){
    console = {
        log : function(){

        }
    };
}
require.config({
		baseUrl : 'res/js',
    paths: {
        routeResolve: 'routeResolve',
				'domReady': 'lib/domReady',
				angular: 'lib/angular.min',
        angularRoute: 'lib/angular-route.min',
        angularResource: 'lib/angular-resource.min',
        angularSanitize: 'lib/angular-sanitize.min',
        cssPath : '../css'
    },
    map: {
      '*': {
        css: 'lib/require-css/css.min'
      }
    },
    shim: {
        'angular': {'exports': 'angular'},
        'angularRoute': {deps : ['angular']},
        'angularResource': {deps : ['angular']},
        'angularSanitize': {deps : ['angular']}
    },
    priority: ['angular']
});

require.config({
    waitSeconds: 15,
    urlArgs : 'v=' + pageConfig.rv
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = "NG_DEFER_BOOTSTRAP!";

require(['angular','appModule'], function () {
  angular.bootstrap(document, ['myapp']);
});
