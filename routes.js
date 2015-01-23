var home = require(ROOT_PATH + '/app/controllers/home');

module.exports = function(server) {
  	server.get('/json/data', home.data);
    server.get('/json/upload', home.upload);
    server.get('/json/snapshot', home.snapshot);

    server.get('*', home.index);

};
