 var winston = require("winston"),
 	date = require("./utils")
 	, formattedDate = date.dateFormat(new Date(), "%Y_%m_%d", true),
 	path = require('path');

winston.emitErrs = true;

var info = path.join(ROOT_PATH, app_config.logPath,  'info', formattedDate+'.log');
var apprequest = path.join(ROOT_PATH, app_config.logPath,  'request', formattedDate+'.log');
var error = path.join(ROOT_PATH, app_config.logPath,  'error', formattedDate+'.log');
var exception = path.join(ROOT_PATH, app_config.logPath,  'exception', formattedDate+'.log');
var dbquery = path.join(ROOT_PATH, app_config.logPath,  'query', formattedDate+'.log');

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
	      new winston.transports.File({ filename: error, name : 'error', level: "error" , maxsize: 5242880}),  
    	  new winston.transports.File({ filename: apprequest, name : 'apprequest', level: 'apprequest' , maxsize: 5242880}),
    	  new winston.transports.File({ filename: info, name : 'info', level: "info",  maxsize: 5242880}),
	      new winston.transports.File({ filename: dbquery, name : 'dbquery', level: 'dbquery' , maxsize: 5242880})
    ],
    handleExceptions: true,
    exceptionHandlers: [
      new winston.transports.File({ filename: exception, maxsize: 5242880 })
    ]
  });
  
  module.exports = logger;
  module.exports.stream = {
	    write: function(message, encoding){
	        logger.log("apprequest", message);
	    }
	};