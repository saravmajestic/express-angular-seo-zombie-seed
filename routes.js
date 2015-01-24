var home = require(ROOT_PATH + '/app/controllers/home'),
	auth = require(ROOT_PATH + '/app/controllers/auth');

module.exports = function(server) {
  	
  	//Auth related routes
  	server.post('/api/signup', auth.signup);
  	server.get('/api/me', auth.me);
  	server.get('/api/logout', auth.logout);
  	server.post('/api/login', auth.login);

    server.get('/api/upload', home.upload);
    server.get('/api/snapshot', home.snapshot);

    server.get('/oauth', function(req, res){
    	res.render('oauth');
    });
    //TODO: if we have * then it will match all routes and will be a overhead in server
    //This should serve only index page and routes defined in angular
    server.get('*', home.index);

};
