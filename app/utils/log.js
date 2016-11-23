 var winston = require("winston")
 dailyRotate = require('winston-daily-rotate-file'),
 	date = require("./utils")
 	, datePattern = '-yyyy-MM-dd.log',
 	path = require('path');

winston.emitErrs = false;

var info = path.join(ROOT_PATH, app_config.logPath, 'info', 'info');
var apprequest = path.join(ROOT_PATH, app_config.logPath, 'request', 'request');
var error = path.join(ROOT_PATH, app_config.logPath, 'error', 'error');
var exception = path.join(ROOT_PATH, app_config.logPath, 'exception', 'exception');
var dbquery = path.join(ROOT_PATH, app_config.logPath, 'query', 'query');

var config = {
	  levels: {
	    silly: 0,
	    verbose: 1,
	    info: 2,
	    data: 3,
	    warn: 4,
	    debug: 5,
	    apprequest: 6,
	    dbquery : 7,
	    error : 8
	  },
	  colors: {
	    silly: 'magenta',
	    verbose: 'cyan',
	    info: 'green',
	    data: 'grey',
	    warn: 'yellow',
	    debug: 'blue',
	    error: 'red',
	    dbquery : 'magenta',
	    apprequest : 'magenta'
	  }
	};

var logger = new winston.Logger({
	exitOnError: false,
	levels: config.levels,
	colors: config.colors,
    transports: [
	      new dailyRotate({ datePattern: datePattern, filename: error, name : 'error', level: "error" , maxsize: 5242880}),  
    	  new dailyRotate({ datePattern: datePattern, filename: apprequest, name : 'apprequest', level: 'apprequest' , maxsize: 5242880}),
    	  new dailyRotate({ datePattern: datePattern, filename: info, name : 'info', level: "info",  maxsize: 5242880}),
	      new dailyRotate({ datePattern: datePattern, filename: dbquery, name : 'dbquery', level: 'dbquery' , maxsize: 5242880})
    ],
    handleExceptions: true,
    exceptionHandlers: [
      new dailyRotate({ datePattern: datePattern, filename: exception, maxsize: 5242880 })
    ]
  });
	//Send email to team when error happens in app
  logger.on('logging', function (transport, level, msg, meta) {
    if(level == 'error' && transport.name == 'error'){
    	if(ENV == 'development'){
    		console.log(msg, meta);
    	}else{
    		var mailDetails = {
				to : [{
		                "email": app_config.internal.error_email,
		                "name": "Error"
		            }],
		        subject : "App error happened!"
			};
			var appData = {
				'msg' : msg,
				'meta' : meta,
				'time' : new Date().toISOString(),
				'node_name' : server.locals.node_name
			};
			emitter.emit('send_mail', 'errors.html', mailDetails, appData);
    	}
    }
  });
  logger.on('error', function (err) { console.log(err); });

  module.exports = logger;
  module.exports.stream = {
	    write: function(message, encoding){
	        logger.log("apprequest", message);
	    }
	};