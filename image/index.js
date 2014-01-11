var tmp = require('tmp'),
	fs = require('fs'),
	util = require('util'),
	url = require('url'),
	easyimage = require('easyimage'),
	express = require('express');

var parser = express.bodyParser();

var post = function (req, res) {
	
	if (!req.files)
		return res.send(404);

	tmp.tmpName({ prefix: "", template: 'XXXXXX'}, function _tempNameGenerated(err, path) {

		var p = req.files.image.path;
		var ext = p.split('.').pop();	
		if (err) throw err;
		var tag = req.body.tag || "calin";
		
		
		var fullPath = "public/images/" + path + "." + ext;
		var is = fs.createReadStream(p);
		var os = fs.createWriteStream(fullPath);

		util.pump(is, os, function() {
			fs.unlinkSync(p);
			res.send("http://leafsha.de/" + path);
			fs.mkdir("public/images/" + tag, function() {
				
				easyimage.info(fullPath, function(err,info) {
					var w = info.width;
					var h = info.height;
					var scale = 200 / Math.max(h,w);
					w *= scale;
					h *= scale;
					easyimage.resize({
						src: fullPath,
						dst: "public/images/" + tag + "/" + path + "." + ext,
						width: w,
						height: h
					}, function() { console.log("Finished thumbnailing"); });

				});
			});
		});	
	});
		
};

var getImage = function (req,res) {
	
	var img = url.parse(req.url).pathname;
	//img = img.substr(img.length - 6);
	img = img.split('/').pop();
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
			res.send(404);
		}
	});

};

var showImages = function(req,res) {
	var tag = url.parse(req.url).pathname.split('/').pop();
	var tagDir = "public/images/" + tag;
	fs.readdir(tagDir, function(err, files) {
		if (err) {
			res.send(404);
		}
		else if (files.length) {
			res.render("images", {images: files, tag: tag})
		}
	});
}

function image (app) {
	this.app = app;
	console.log("lol");
	app.post("/upload", parser, post);
	app.get("/i/*", getImage);
	app.get("/gallery/*", showImages)
}

module.exports = function(app) { return new image(app); };
