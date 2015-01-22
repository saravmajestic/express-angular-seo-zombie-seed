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
        angularMocks: 'lib/angular-mocks'
    },
    shim: {
        'angular': {'exports': 'angular'},
        'angularRoute': {deps : ['angular']},
        'angularResource': {deps : ['angular']},
        'angularSanitize': {deps : ['angular']},
        'angularMocks': {deps: ['angular'], 'exports': 'angular.mock'}
    },
    priority: ['angular']
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = "NG_DEFER_BOOTSTRAP!";

require([
    'angular',
    'appModule'
], function () {

	// if(navigator.userAgent === 'zombiejs'){
	// 	angular.bootstrap(document, ['myapp']);
	// }else{
  //  		angular.element(document).ready(function() {
  //       	angular.bootstrap(document, ['myapp']);
  //  		});
  //   }

angular.bootstrap(document, ['myapp']);
});
