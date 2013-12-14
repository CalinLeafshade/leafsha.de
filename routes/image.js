var tmp = require('tmp');
var fs = require('fs');
var util = require('util');
var url = require('url');

var post = function (req, res,next) {
		
		var pp = url.parse(req.url).pathname
		if (pp.length < 7 || pp.substr(pp.length - 6) != "upload")
		{
			next()
		}
		else
		{
			tmp.tmpName({ prefix: "", template: 'XXXXXX'}, function _tempNameGenerated(err, path) {
				var ext = req.files.image.path.split('.').pop();	
		    	if (err) throw err;
		    	var p = req.files.image.path;
		    	var is = fs.createReadStream(p);
				var os = fs.createWriteStream("public/images/" + path + "." + ext);

				util.pump(is, os, function() {
		    		fs.unlinkSync(p);
		    		res.send("http://leafsha.de/" + path);
				});
				
			});
		}
	};


var get = function (req,res,next) {
	
		var img = url.parse(req.url).pathname;
		img = img.substr(img.length - 6);
		var file = "public/images/" + img + ".png";
		console.log("looking for " + file);
		fs.exists(file, function(exists) {
  			if (exists) 
  			{
				console.log("request for " + img);
				res.sendfile(file);
  			} 
  			else 
  			{
    			next();
  			}
		});

	};

exports.image = function(req,res,next)
{
	console.log(req.method);
	if (req.method == "POST") post(req,res,next);
	else if (req.method == "GET") get(req,res,next);
	else next();
}