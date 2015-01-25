{
  appDir: '../public',
  //baseUrl : 'test1',
  mainConfigFile: '../public/res/js/appBootstrap.js',
  dir: '../public-build',
  modules: [
  //First set up the common build layer.
{
  //module names are relative to baseUrl
  name: './appBootstrap',
  //List common dependencies here. Only need to list
  //top level dependencies, "include" will find
  //nested dependencies.
  exclude : [
    
  ],
  include: [
    'routeResolve',
    'appRoutes',
    'appModule',
    'common/ajax',
    'app/pages/auth/authSvc'
  ]
},

//Now set up a build layer for each main layer, but exclude
//the common one. "exclude" will exclude nested
//the nested, built dependencies from "common". Any
//"exclude" that includes built modules should be
//listed before the build layer that wants to exclude it.
//The "page1" and "page2" modules are **not** the targets of
//the optimization, because shim config is in play, and
//shimmed dependencies need to maintain their load order.
//In this example, common.js will hold jquery, so backbone
//needs to be delayed from loading until common.js finishes.
//That loading sequence is controlled in page1.js.
{
  //module names are relative to baseUrl/paths config
  name: 'app/pages/home/homeCtrl',
  exclude: ['./appBootstrap'],
  include : [
  'app/pages/home/homeCtrl'
  ]
},

{
  //module names are relative to baseUrl
  name: 'app/pages/auth/authCtrl',
  exclude: ['./appBootstrap'],
  include : [
    'lib/hello.min',
    'app/pages/auth/authCtrl'
  ]
}

]
}
