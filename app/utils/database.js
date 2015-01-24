var fs = fs = require('fs');

exports = mongoose = require('mongoose');
exports = Schema = mongoose.Schema;

module.exports = Database = {
	initModels : function(){
		// Bootstrap models
		var models_path = ROOT_PATH + '/app/models'
		var model_files = fs.readdirSync(models_path);
		model_files.forEach(function(file){
		    require(models_path+'/'+file)
		});
	},
	// initialize DB
	connectDB: function() {
	    var config_db = require(ROOT_PATH + '/config/'+ENV+'/database.json');
	    mongoose.connect(config_db.uri);
	    // Check connection to mongoDB
	    mongoose.connection.on('open', function() {
		    logger.info( 'We have connected to mongodb');
		});
	    mongoose.connection.on('error', function(err) {
		    logger.error('We have error while connecting to mongodb', err);
		});
	    if(config_db.debug){
		    mongoose.set('debug', function(collectionName, method, query, doc){
		    	logger.dbquery( "DB: ", collectionName, method, JSON.stringify(query));
		    	});
	    }
	},
	// disconnect from database
	closeDB: function() {
	  	mongoose.disconnect();
	}
};

Database.connectDB();
Database.initModels();