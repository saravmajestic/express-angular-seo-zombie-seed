exports.data = function(req, res){
	var cities = [
		{
			code: 'boston',
			displayName: 'Boston, MA',
			search: 'Boston,%20MA,%20US'
		},
		{
			code: 'new-york',
			displayName: 'New York, NY',
			search: 'New%20York,%20NY,%20US'
		},
		{
			code: 'portland',
			displayName: 'Portland, OR',
			search: 'Portland,%20OR,%20US'
		},
		{
			code: 'san-francisco',
			displayName: 'San Francisco, CA',
			search: 'San%20Francisco%20,%20CA,%20US'
		},
		{
			code: 'seattle',
			displayName: 'Seattle, WA',
			search: 'Seattle,%20WA,%20US'
		}
	];
	res.json({"isSuccess" : true, data : cities});
};
exports.index = function(req, res){
	res.render('index', {zombie : req.zombie});
};

exports.snapshot = function(req, res){
	try{
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
	}catch(err){
		console.log(err);
	}
}

exports.upload = function(req, res){
	try{
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
	}catch(err){
		console.log(err);
	}
}
