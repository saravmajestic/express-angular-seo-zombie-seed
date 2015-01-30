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
                templateUrl: '/res/js/app/pages/root/root.html',
                dependencies: ['app/pages/root/rootCtrl'],
                meta : {
                  title : 'Complete AngularJS + RequireJS SPA Seed Project',
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
            },
            '/profile/edit': {
                templateUrl: '/res/js/app/pages/profile/editProfile.html',
                dependencies: [ 'app/pages/profile/profileCtrl' ],
                meta : {
                  title : 'Edit Profile Page',
                  description : "Description for Edit Profile page",
                  keywords : "keywords for Edit Profile page"
                },
                authCheck : true
            }
        }
    };
});
