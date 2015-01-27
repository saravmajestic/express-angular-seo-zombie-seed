'use strict';

define([], function() {
    return {
        defaultRoutePath: '/',
        routes: {
            '/home': {
                templateUrl: '/res/js/app/pages/home/home.html',
                dependencies: [ 'app/pages/home/homeCtrl' ],
                meta : {
                  title : 'Home Page',
                  description : "Description for home page",
                  keywords : "keywords for home page"
                }
            },
            '/': {
                templateUrl: '/res/js/app/pages/home/in.html',
                dependencies: [],
                meta : {
                  title : 'Angular SEO Seed project',
                  description : "Description for root page",
                  keywords : "keywords for root page"
                }
            },
            '/auth': {
                templateUrl: '/res/js/app/pages/auth/auth.html',
                dependencies: [ 'app/pages/auth/authCtrl' ],
                meta : {
                  title : 'Login Page',
                  description : "Description for login page",
                  keywords : "keywords for login page"
                }
            }
        }
    };
});
