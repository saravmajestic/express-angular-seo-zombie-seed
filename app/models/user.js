var Validator 	= require('validator').Validator, utils 	= require('../utils/utils'),
    crypto 		= require('crypto');

var exports = module.exports = UserSchema = new mongoose.Schema({});

UserSchema.add({
    uid: 		{type: String, default : '', index: true, unique : true },
    email:      {type: String, index: true, unique: true },
    provider:   {type: String, index: true, unique: false },
	password: 	{type: String, select: false},
  	first_name: 	{type: String, default : '', required : false, index: true },
  	lastname: 	{type: String, default : '', required : false, index: true },
  	picture: 	{type: String, default : '', index: true },
    gender: 	{type: String, default : '', index: false },
    dob: 		{type: Date},
    phone : 	{type: String, default : '', index: false},
    updated_at: {type: Date, default: Date.now, select: false },
    created_at: {type: Date, default: Date.now, select: false }
});
UserSchema.pre('save', function(next){console.log('hi');
	if(!this.created_at){
		this.created_at = (new Date()).toISOString();
	}

	this.updated_at = (new Date()).toISOString();

	next();
});
/** 
 * Find user by id
 * @static
 */
UserSchema.statics.findUserById = function (id, callback) {
	this.findOne({_id: id}, callback);
};

/**
 * Verify Password
 * @static
 */
UserSchema.statics.verifyPassword = function (password, user) {
    return user.password == password;
};

/**
 * Authenticate user 
 *
 * @api static
 */
UserSchema.statics.login = function(email, password, callback) {
	var User = mongoose.model('User');
	
	this.findOne({ email: { $regex: email, $options: 'i'}}, {password : 1, email : 1}, function (err, user) {
		if (err) callback(err, null);
		if(user) {

			if (user.email && user.password === User.sign(password, 'md5')) {
				callback(null, user);
			} else {
				callback("Invalid password.", null);
			}

		} else {
			callback("You are not registered. Please signup.", null);
		}
	});
};

/**
 * Encode string with hash method sha1 or md5
 *
 * @api static
 * @todo move to utils
 */
UserSchema.statics.sign = function(str, hash) {
	return require('crypto').createHash(hash).update(str.toString()).digest('hex');	
};

/**
 * Register user (not used)
 *
 * @api static
 */
UserSchema.statics.signup = function(data, callback) {
	var User = mongoose.model('User');
	var user = new User();

	data.password = User.sign(data.password, 'md5');
	//TODO: verify whether "pre" is getting called when saving this document after updating to mongoose 3.9.8
	/*User.findOneAndUpdate({'email' : params.email}, {$set : params}, {upsert : true, new : true}, function(err, user){
		
	});*/

    User.findOne({email:{ $regex: data.email, $options: 'i'}}, function(err, user) {
        if(err){
            callback(err);
        }else
        if (user){
            callback('USER_EXISTS');
    	}else{
            // append date stamp when record was created //
            var user = new User(data);
            user.save(function (err, savedUser) {
                if (err) {
                    logger.error("In signup: Couldnt save new user: ", err);
                    callback(err);
                    return;
                } else {
                    logger.info("User '" + data.email + "' created: ");
                    callback(null, savedUser);
                }
            });
            
        }
    });

}

/* private encryption & validation methods */

UserSchema.statics.generateSalt = function()
{
    var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
    var salt = '';
    for (var i = 0; i < 10; i++) {
        var p = Math.floor(Math.random() * set.length);
        salt += set[p];
    }
    return salt;
}

UserSchema.statics.md5 = function(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

UserSchema.statics.saltAndHash = function(pass, callback)
{
    var salt = this.generateSalt();
    callback(salt + this.md5(pass + salt));
}

UserSchema.statics.validatePassword = function(plainPass, hashedPass, callback)
{
    var salt = hashedPass.substr(0, 10);
    var validHash = salt + this.md5(plainPass + salt);
    return (hashedPass === validHash);
}
/**
 * Validate user form when create or update
 *
 * @api static
 */
UserSchema.statics.validateUser = function(req) {
	req.assert(['User', 'email'], 'Please enter a valid Email').isEmail();		
  	req.assert(['User', 'username'], 'Please enter a Username').notEmpty();
  	req.assert(['User', 'first_name'], 'Please enter a Firstname.').notEmpty();
  	req.assert(['User', 'lastname'], 'Please enter a Lastname.').notEmpty();	
  	req.assert(['User', 'gender'], 'Please fill out gender.').notEmpty();	
	return req.validationErrors();
};

/**
 * Update user
 *
 * @api static
 */
UserSchema.methods.updateAll = function(user, callback) {
	var User = mongoose.model('User');
	this.username 		= user.username;
	this.first_name 	= user.first_name;
	this.lastname 		= user.lastname;
	this.email 			= user.email;
	this.gender			= user.gender;
	this.activated 	= (typeof user.activated === "undefined" ? false : true);
	
	this.save(callback);					// save the user		
};

UserSchema.statics.findUsers = function(query, fields, callback){
	this.find(query, fields, function (err, users) {
		callback(err, users);
	});
}

exports = module.exports = mongoose.model('User', UserSchema);