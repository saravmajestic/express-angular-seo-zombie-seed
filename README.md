# express-angular-seo-zombie-seed
NodeJS express project with angular and using zombie for SEO 

Tech Stack
======
- NodeJS with Express JS
- MongoDB
- Google cloud storage for CDN

Frameworks
=========
- Express JS
- AngularJS with requireJS
- Zombie for generating pages for SEO
- hello.js (for social login)
- Gulp

Why did I create this project?
===
I wanted to migrate one of my live site to use above mentioned stack and frameworks. I tried different frameworks
- sailsJS - didnt work out because it  is using older express version
- MEAN.io - is little complicated for me to understand and it has lot of code out of the box. 

Other seed projects were good for development environment and when it comes to actual production environment, I need to accomplish these tasks
- RequireJS loads my scripts (angular controller, service, etc) asynchronously, that's great. But I dont want to load each controller as separate file. I want to combine and minify files per page/view, so I can load minimum number of files in production environment. This can be accomplished using r.js optimizer and it has to be integrated with gulp task
- SEO for single page applications using angularJS. Read this blog. I tried angular-server and that gave me good results. But it didnt work out with requireJS. So, I used ZombieJS to generate my html pages in server side and render those for bots 
- Logging - load my db queries, http requests received and error logs separately. This will be helpful for tracking
- CDN implementation - this is a common requirement for most of the projects. I have used Google Cloud storage as CDN for this project
- Social Logins. I used hello.js for accomplishing this
- Configs for different environment

Steps to install
---
- clone the git repo
- ```npm install```
- Run gulp task ```./node_modules/gulp/bin/gulp.js``` This will build all necessary resources mentioned as in ```build/build.js``` and add it to 'public-build' directory. This will also have livereload enabled.
- Run ```node server.js```
- Open the page with ip address and port mentioned in the console
- For checking SEO page(angular rendered from server side), open ```http://<ip address>:<port>/api/snapshot```. This will render html content of your root (/) page

TODO
====
- load combined view files instead of separate partials for each page
- Avoid adding logs to all folders. Currently logs are cumulatively added for lower levels. If log level is 5, all logs with levels < 4 will include logs of level 5. So it ie getting duplicated.
- Control loading index.html for unhandled requests. Since I am using * in routes.js, if any the request is not handled, this file will be loaded. 