
var express = require('express'),
	routes = require('./routes'),
	user = require('./routes/user'),
	ImagePost = require('./image'),
	path = require('path'),
	Poet = require('poet');
	
var app = express();




links = [
	{ url: '/blog', name: 'blog'},
	{ url: '/games/', name: 'games'},
	{ url: '/gallery/calin', name: 'gallery'}
  ];

app.use(function(req,res,next){
	res.locals.url = req.url;
	res.locals.links = links
	next();
});

var poet = Poet(app, {
  posts: './_posts/',
  postsPerPage: 5,
  metaFormat: 'json'
});

poet.watch().init();



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('title', 'leafsha.de')
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

var image = ImagePost(app);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var defaultBlogRoute = function (req, res, next) {
	var
		postsPerPage = poet.options.postsPerPage,
		page = 1
		lastPost = page * postsPerPage,
		posts = poet.helpers.getPosts(lastPost - postsPerPage, lastPost);
	if (posts) {
		res.render("page", {
			posts: posts,
			page: page
		});
	} else {
	  next();
	}
}

app.get("/", defaultBlogRoute);
app.get("/blog", defaultBlogRoute);

app.listen(app.get('port'));
console.log('Express app started on port ' + app.get('port'));