'use strict';

require.config({
		baseUrl : 'res/js',
    paths: {
        routeResolve: 'routeResolve',
				'domReady': 'lib/domReady',
				angular: 'lib/angular',
        angularRoute: 'lib/angular-route',
        angularResource: 'lib/angular-resource',
        angularSanitize: 'lib/angular-sanitize',
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

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = "NG_DEFER_BOOTSTRAP!";

require(['angular','appModule'], function () {
  angular.bootstrap(document, ['myapp']);
});
