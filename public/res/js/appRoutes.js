'use strict';

define([], function() {
    return {
        defaultRoutePath: '/',
        routes: {
            '/home': {
                templateUrl: '/res/js/app/pages/home/home.html',
                dependencies: [ 'app/pages/home/homeCtrl' ]
            },
            '/': {
                templateUrl: '/res/js/app/pages/home/in.html',
                dependencies: [ 'app/rootCtrl' ]
            },
            '/auth': {
                templateUrl: '/res/js/app/pages/auth/auth.html',
                dependencies: [ 'app/pages/auth/authCtrl' ]
            }
        }
    };
});
