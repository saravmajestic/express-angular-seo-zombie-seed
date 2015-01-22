var buy = require('./buy'), home = require('./home');

module.exports = function(server) {
    server.get('/json/home', buy.all);
  	server.get('/json/data', home.data);
    server.get('/json/upload', home.upload);
    server.get('/json/snapshot', home.snapshot);

    server.get('*', home.index);

}
