exports.index = function(req, res){
	var user = req.session ? req.session.user : null;
	
	server.locals.resourceUrl = app_config.resourceUrl || server.locals.ctxUrl;//For serving static resources (JS, CSS) and site images
	
	res.render('index', {zombie : req.zombie, user : user});
};

exports.snapshot = function(req, res){
		var Browser = require('zombie');
		var browser = Browser.create();
		browser.userAgent = "zombiejs";
		browser.visit('http://'+ipaddress+':' + port + '/home', function (err) {
			if(err){
				console.log(err.message);
				return;
			}
			var html = browser.html();
			html = html.replace(/<script.*?>.*?<\/script>/gim, "")
			res.end(html);
		});
}
exports.saveImage = function(req, res){
	var data = req.body;
	
	require('../utils/utils').saveFile(data.image, data.fileName, '/', 
		function(err, finalFileName){
			res.json({isSuccess : true, err : err, data : finalFileName});
	});
};
exports.saveFile = function(req, res){
	var busboy = require('connect-busboy');
 	var fileName = null;
	req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
	    var fx = require("fs-extra");
	    var fs = require("fs");
	    fileName = filename;
	    var uploadRootPath = DATA_DIR + app_config.uploadPath;
  		var fileDirPath = '';//any specific folder
		var fileUploadPath = uploadRootPath + fileDirPath;
		
		  logger.info("saveFile: Saving file: in path: %s/%s" ,fileUploadPath, filename);
		  var fx = require("fs-extra");
		  fx.ensureDir(fileUploadPath, function(err) {
		    if(err){
		    	logger.error('Not able to create folder: ', fileUploadPath, err);
		    	res.json({isSuccess : false});
		    }else{
		    	file.pipe(fs.createWriteStream((fileUploadPath + filename)));
		    }
		  });
	  });
	  req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {
	    console.log(arguments);
	  });
	  req.busboy.on('finish', function() {
	  	logger.info('file uploaded:', fileName);
	  	res.json({isSuccess : true, fileName : fileName});
	  });
	  req.pipe(req.busboy);
};
exports.upload = function(req, res){
		var service_account_name = app_config.google.service_account_name;
		var key_file_location = ROOT_PATH + '/keys/google/' + app_config.google.key;

		var CloudStorage = require('cloud-storage');
		var storage = new CloudStorage({
			accessId: service_account_name,
			privateKey: key_file_location
		});
		var currentDate = new Date();
		currentDate.setYear(2020);
		// if you want to get crazy you can pass in options and metadata
		var options = {
			headers: {
				'Cache-Control': 'public,max-age=31556940',
				'X-Goog-Acl': 'public-read'
			},
			metadata: {
				'expires': currentDate
			},

			// remove the original file on disk after it is copied
			// removeAfterCopy: true,

			// force an extension to be added to the destination
			forceExtension: true
		};
		// copy a local file or a url
		storage.copy(__dirname + '/<sample file>', 'gs://'+app_config.google.bucket+'/<file name with extn>', options, function(err, url) {
			// public url for your file
			console.log(err, url);
			res.end(url);
		});
}
