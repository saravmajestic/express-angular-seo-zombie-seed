exports.all = function(req, res){
    try{
    	res.render("index", {"name" : "Sarav"});
    }catch(err){
		console.log(err);
		res.json({"isSuccess" : false, msg : (err.message || err)});
	}
};