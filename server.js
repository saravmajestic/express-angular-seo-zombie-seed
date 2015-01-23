global.ROOT_PATH = __dirname;
global.ENV = process.env.ENV || "development";
exports = port = (process.env.PORT || 8080);

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
	device = require('express-device');

var server = express();
exports = app_config = require(ROOT_PATH + '/config/'+ENV+'/app.json');

exports = logger = require(ROOT_PATH + '/app/utils/log');

require(ROOT_PATH + '/app/utils/database');

server.set('port', port);
server.use(bodyParser.json());
//https://github.com/expressjs/body-parser#bodyparserurlencodedoptions
server.use(bodyParser.urlencoded({extended : true}));
server.use(cookieParser());
server.use(device.capture());
server.set('views', __dirname + '/views');
server.set('view engine', 'html'); // set up html for templating
server.engine('.html', require('ejs').__express);
server.use(session({
	resave : false,
	saveUninitialized : false,
	name : 'ch.sess.id',
    secret: 'C63f#057',
    store: new MongoStore({ mongooseConnection: mongoose.connection })
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
server.use(myErrorHandler);

/**
 * Override res.json to do any pre/post processing
 * https://gist.github.com/mrlannigan/5051687
 */
if(ENV === "development" ){
	server.use(function(req, res, next) {
		var renderJson = res.json;
		res.json = function(respObj, fn) {
			console.log("in json");
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
}
server.use('/res', express.static(path.join(__dirname, './public-build/res')));
server.use(function(req, res, next){
	req.zombie = ((req.headers['user-agent'] == 'zombiejs') || (req.query && req.query.zombie == 'true'));
	next();
});

//Routes for all commands
require('./routes.js')(server);

server.set('jsonp callback name', 'callback');

exports = ipaddress = getIPAddress();
if(app_config.resourceUrl){
	server.locals.resourceUrl = app_config.resourceUrl;
}else{
	server.locals.resourceUrl = "http://" + ipaddress + ":" + port + "/";
}
server.listen(port, ipaddress, function() {
	console.log('%s: Node server started on %s:%d ...', Date(Date.now()), ipaddress, port);
});

function myErrorHandler(err, req, res, next) {
	logger.error(err.stack);
	res.send(500, {
		"isSuccess" : false
	});
}

function getIPAddress() {
	var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
	if (typeof ipaddress === "undefined") {
		var os = require('os');
		var ifaces = os.networkInterfaces();
		for ( var dev in ifaces) {
			var alias = 0;
			ifaces[dev].forEach(function(details) {
				if (details.family === 'IPv4') {
					console.log(dev + (alias ? ':' + alias : ''), details.address);
					ipaddress = details.address;
					++alias;
				}
			});
		}
		console.warn('No OPENSHIFT_NODEJS_IP var, using ' + ipaddress);
	}
	return ipaddress;
}
