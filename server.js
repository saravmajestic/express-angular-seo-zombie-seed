global.ROOT_PATH = __dirname;
global.ENV = process.env.ENV || "development";
exports = port = (process.env.PORT || 8080);
global.DATA_DIR = process.env.OPENSHIFT_DATA_DIR || ROOT_PATH;
exports = app_config = require(ROOT_PATH + '/config/'+ENV+'/app.json');
exports = logger = require(ROOT_PATH + '/app/utils/log');

process.on('uncaughtException', function(err) {
	console.log('uncaughtException caught the error', err.message, err.stack);
	logger.error('uncaughtException caught the error', err.message, err.stack);
});

/**
 * Module dependencies.
 */
var express = require('express'),
	cookieParser = require('cookie-parser'),
	methodOverride = require('method-override'),
	bodyParser = require('body-parser'),
	http = require('http'),
	path = require('path'),
	fs = require('fs'),
	morgan = require('morgan'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	device = require('express-device'),
	compress = require('compression');

exports = server = express();

//Resource version for cache busting
if(!app_config.resVersion){
	app_config.resVersion = Math.floor(Math.random() * (1001));
}
server.locals.res_version = app_config.resVersion;


require(ROOT_PATH + '/app/utils/database');

server.set('port', port);
server.use(compress());  
server.use(bodyParser.json());
//https://github.com/expressjs/body-parser#bodyparserurlencodedoptions
//5MB for image upload options
server.use(bodyParser.urlencoded({extended : true, limit: '7mb'}));
server.use(cookieParser());
server.use(device.capture());
server.set('views', __dirname + '/views');
server.set('view engine', 'html'); // set up html for templating
server.engine('.html', require('ejs').__express);
server.use(session({
	resave : false,
	saveUninitialized : false,
	name : 'ng.sess.id',
    secret: 'secret',
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
server.use(require('connect-busboy')({
  limits: {
    fileSize: 7 * 1024 * 1024//4 MB
  }
}));
morgan.token('sessionId',
		function (req, res) {
		    if (!req.session) return '~'; // should never happen
		    if (req.session.user) {
		        return "user_id:" + req.session.user.id;
		    }
		    else {
		        return '-';
		    }
		});
server.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url" :status :res[content-length] ":referrer" ":user-agent"  - :response-time ms :sessionId', {"stream": logger.stream}));
server.use(methodOverride());

/**
 * Override res.json to do any pre/post processing
 * https://gist.github.com/mrlannigan/5051687
 */
//if(ENV === "development" ){
	server.use(function(req, res, next) {
		var renderJson = res.json;
		res.json = function(respObj, fn) {
			var isJsonpCall = req.query.callback || req.body.callback;
			var self = this;
			//For local testing, returning jsonp response
			if (isJsonpCall) {
				res.jsonp(respObj);
			} else {
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(respObj));
			}
		};
		next();
	});
//}
server.use('/res', express.static(path.join(__dirname, './dist/res'), {
	setHeaders : function(res, path){
		if(ENV !== 'development'){
			var currentDate = new Date();
			currentDate.setYear(2020);
			res.setHeader('Cache-Control', 'public, max-age=31556940');
			res.setHeader('expires', currentDate);
		}
	}
}));

//uploaded files
server.use('/static', express.static(path.join(global.DATA_DIR, app_config.uploadPath)));

exports = ipaddress = (process.env.OPENSHIFT_NODEJS_IP || process.env.NODEJS_IP);

//Use this middleware only if you need SEO support for the pages
if(app_config.enableZombie){
	server.use(function(req, res, next){
		//If request is from bots
		//Exclude this for sitemaps
		if((req.device.type === 'bot' || (req.query && req.query['ngserver'] === 'true')) && req.url.indexOf('sitemap.xml') == -1){
			var ctxUrl = (ENV == 'production') ? app_config.ctxUrl : req.protocol + '://' + req.headers.host + "/";
			ctxUrl = ctxUrl.slice(0, - 1);
			//create a zombie browser with useragent as zombie
			var Browser = require('zombie');
			var browser = Browser.create({localAddress : ipaddress});
			browser.userAgent = "zombiejs";
			logger.info("In SEO for BOT: ", {url : req.url, headers : req.headers});
					
			browser.visit(ctxUrl + (req.url.replace('ngserver','n')), function (err) {
				var response = browser.resources[0].response;
				if(err){
					logger.error("Error in SEO: ", {stack : err.stack, message : err.message, headers : req.headers});
					res.status(response.statusCode); 
					res.render('' + response.statusCode);
					return;
				}
				
				res.header('Content-Type', response.headers['content-type']);
				var html = browser.body.innerHTML;
				if(response.headers['content-type'].indexOf('text/html') != -1){
					html = html.replace(/<script.*?>.*?<\/script>/gim, "");
					//html = html.replace(/<link.*?stylesheet.*?>/gim, "");
					//html = html.replace(/<style.*?>.*?<\/style>/gim, "");
					html = html.replace(/(?:\r\n|\r|\n)/g, '');
					html = '<!DOCTYPE html><html lang="en" class="no-js">' + html;
					html = html.replace('<header>', '<body><header>');
					html = html + '</body></html>';
					logger.info('SEO response: ', req.url, html);
				}
				res.end(html);
				browser.close();
			});
		}else{
			next();
		}
	});
}
server.use(function(req, res, next){
	req.zombie = ((req.headers['user-agent'] == 'zombiejs') || (req.query && req.query.zombie == 'true'));
	if(req.zombie){
		logger.info("Zombie request: " + req.url);
	}
	var reqUrl = req.url;
	if (reqUrl.indexOf('/') === 0){
        reqUrl = reqUrl.substring(1);
    }
	//Redirect to www version if request url does not have www
	if(ENV == 'production' && req.headers['host'] == 'chefhost.kitchen'){
		res.redirect(301, app_config.ctxUrl + reqUrl);
	}else{
		server.locals.ctxUrl = app_config.ctxUrl || req.protocol + '://' + req.headers.host + "/";
		next();
	}
});
//Routes for all commands
require('./routes.js')(server);
server.use(myErrorHandler);

server.set('jsonp callback name', 'callback');

server.locals.node_name = process.env.APP_NAME;
server.locals.env = ENV;
server.listen(port, ipaddress, function() {
	console.log('%s: Node server started on http://%s:%d ...', Date(Date.now()), (ipaddress || 'localhost'), port);
});

function myErrorHandler(err, req, res, next) {
	logger.error("Error happened in %s", req.path, err.stack, err.message, err, req.headers);
	
	if(req.url.indexOf('/api/') == 0){
		var extra = null;
		if(ENV !== "production"){
			extra = {stack : err.stack, message : err.message};
		}
		res.json({"isSuccess" : false, errMsg : "Internal error happened!", extra : extra});
	}else{
		res.setHeader('Content-Type', 'text/html');
		res.status(404); 
		res.render('404');
	}
}