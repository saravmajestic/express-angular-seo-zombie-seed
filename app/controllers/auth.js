exports.signup = function(req, res){
		var params = req.body;
		var User = mongoose.model('User');
			User.signup(params, function(err, user){
				if(err){
					logger.error("Signup failed %s %s %j", params.first_name, params.email, params, err);
					res.json({isSuccess : false, err : err});
				}else{
					logger.info("Signup completed for %s", params.first_name);
					req.session.user = user;
					res.json({isSuccess : true, user : user});
				}
			});
			
};
exports.logout = function(req, res){
		if(req.session){
			req.session.destroy();
		}
		res.json({isSuccess : true});
};
exports.login = function(req, res){
		var params = req.body;
		var User = mongoose.model('User');
		User.login(params.email, params.password, function(err, user){
			if(err){
				logger.error("login API failed %s", params.email, err);
				res.json({isSuccess : false, user : null, errMsg : err});
			}else{
				req.session.user = user;
				res.json({isSuccess : true, userId : user['_id']});
			}
		});
		
	
};
exports.me = function(req, res){
		if(req.session && req.session.user){
			var User = mongoose.model('User');
			User.findOne({email : req.session.user.email}, function(err, userDoc){
				if(err){
					logger.error("Me API failed %s", req.session.user.email, err);
					res.json({isSuccess : false, user : null});
				}else{
					req.session.user = userDoc;
					res.json({isSuccess : true, user : userDoc});
				}
				
			});
		}else{
			res.json({isSuccess : false, user : null});
		}
}