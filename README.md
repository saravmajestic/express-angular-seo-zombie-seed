# express-angular-seo-zombie-seed
NodeJS express project with angular and using zombie for SEO

##Tech Stack##

- NodeJS with Express JS
- MongoDB with Mongoose layer
- Google cloud storage for CDN

##Frameworks##

- Express JS (4.11.0)
- AngularJS (1.3.8) with requireJS
- [Zombie](https://github.com/assaf/zombie "Zombie") for generating pages for SEO
- [hello.js](http://adodson.com/hello.js/ "hello.js") (for social login)
- Gulp for task management

##Basic requirements for a site##

- Miniumum number of http requests
- Single Page application in client side
- Since we are using AngularJS for single page application, SEO has to be handled
- Logging - load my db queries, http requests received and error logs separately. This will be helpful for tracking
- CDN implementation - this is a common requirement for most of the projects. I have used Google Cloud storage as CDN for this project
- Configs for different environment
- Social Logins with regular signup/login

##What is included in this project##

- Server with nodeJS and expressjs framework. File: `server.js`
- MongoDB integration with Mongoose layer. File: `app/utils/database.js`
- Single Page application starter kit using **AngularJS, RequireJS**. File: `public/res/js/appModule.js` and `public/res/js/appBootstrap.js`
- **SEO support** by rendering the pages in server side using **Zombie** framework. Reference: [Seo for Single Page Applications](http://www.intridea.com/blog/2014/9/18/seo-for-single-page-applications) File: in `server.js` look for `app_config.enableZombie`
- **[r.js](http://requirejs.org/docs/optimization.html) optimizer** integration for whole project using gulp. File: `build/build.js`
- r.js support for CSS also using [require-css](https://github.com/guybedford/require-css). You can load CSS on demand for the pages are you are in, instead of loading all CSS.
- **[Google cloud storage](https://cloud.google.com/storage/) CDN** integration for static resources and dynamic assets like user uploaded images through gulp task. File: `gulpfile.js`
- Complete **social Logins **using [hello.js](http://adodson.com/hello.js/) in client side. File: `public/res/js/app/pages/auth/authCtrl.js`
- **Environment specific configurations** in `config` directory
- **Separate logging** for DB queries, http requests, error etc, using [winston](https://github.com/flatiron/winston) and [morgan](https://github.com/expressjs/morgan). File: `app/utls/log.js`
- **JSONP support** for data from server. File: `server.js` look for `renderJson`
- **Auth check for client side routes**. example: "Edit your Profile" page in the code. Reference: [Protecting routes in AngularJS](http://blog.john.mayonvolcanosoftware.com/protecting-routes-in-angularjs/). File: `public/res/js/routeResolve.js` and `public/res/js/appRoutes.js`
- **Dynamic meta content** like page title, meta description, meta content for SEO. Reference: [StackOverflow](http://stackoverflow.com/questions/12506329/how-to-dynamically-change-header-based-on-angularjs-partial-view) File: `public/res/js/appModule.js` and look for `setMeta`. Configuration is mentioned in `public/res/js/appRoutes.js`
- **Session handling ** using MongoStore. File: `server.js`
- **Global variables** for client side templates like CDN url prefix for images, etc.. File: `public/res/js/appModule.js` and look for `$rootScope.globals`

##Steps to install##

- clone or download or fork this git repo
- Run ```npm install``` to install dependencies
- Run gulp task ```./node_modules/gulp/bin/gulp.js``` This will build all necessary resources mentioned as in ```build/build.js``` and add it to `dist` directory. This will also have [livereload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) enabled.
- The above gulp task will also start the server and display the IP address and port in which it is started.
- The above task will also listen for changes inside `public` folder and re builds the resources whenever there is a change.
- For checking SEO page(angularJS page rendered from server side), add ```ngserver=true``` to the page URL. ex: `http://<ipaddress>:<port>/?ngserver=true`. This will render html content of your root (/) page


##How to add new page##

- add new directory inside ```public/res/app/pages``` ex: `settings`
- add controller, service, css, template files as needed inside this directory
- Add the new route in ```appRoutes.js```, ex: `/settings`
- Add the new module inside ```build/build.js```

###Production Deployment###

- In `gulpfile.js` we hav added `optimizer=none` in the task `build`. This will not minify the files when running the build for easy debugging during development. Remove this `optimizer=none` while doing production deployment to minify the files
- If you want to upload files to CDN, here I used Google Cloud storage, uncomment `gulp.task('default', ['uploadJS', 'uploadCSS']);` in `gulpfile.js`. Make sure you add necessary keys and bucket names in `app.json` configs. Running this task will upload CSS and JS files to the CDN bucket

###Coming soon###

- load combined view files instead of separate partials for each page
- Avoid adding logs to all folders. Currently logs are cumulatively added for lower levels. If log level is 5, all logs with levels < 4 will include logs of level 5. So it ie getting duplicated.
- Control loading index.html for unhandled requests. Since I am using `*` in `routes.js`, if any the request is not handled, `index.html` will be loaded.
- Client side caching data using [angular-cache](http://angular-data.pseudobry.com/documentation/api/angular-cache/angular-cache)