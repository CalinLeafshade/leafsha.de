var tmp = require('tmp');
var fs = require('fs');
var util = require('util');
var url = require('url');

exports.upload = function (req, res) {
	

	tmp.tmpName({ prefix: "", template: 'XXXXXX'}, function _tempNameGenerated(err, path) {
		var ext = req.files.image.path.split('.').pop();	
    	if (err) throw err;
    	var p = req.files.image.path;
    	var is = fs.createReadStream(p);
		var os = fs.createWriteStream("public/images/" + path + "." + ext);

		util.pump(is, os, function() {
    		fs.unlinkSync(p);
    		res.send("http://leafsha.de/img/" + path);
		});
		
	});
	
};

exports.get = function (req,res) {
	
	var img = url.parse(req.url).pathname;
	img = img.substr(4);
	console.log("request for " + img);
	res.sendfile("public/images/" + img + ".png");

}