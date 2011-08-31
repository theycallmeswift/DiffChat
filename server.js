// Dependencies
var express = require('express');
var ejs = require('ejs');
var everyauth = require('everyauth');
var nko = require('nko')('MhTFyLuKyNrrHJcM')
var less = require('less');
var mongoose = require('mongoose');
var nowjs = require("now");
var Comment = require('./app/models/comment');

var app;
var port = 3000;
var github_app_id;
var github_secret;

// Models

// Create the server
app = module.exports = express.createServer();

// Development Config
app.configure('development', function(){
  github_app_id = "f8887f4f6c5b2beb39a3";
  github_secret = "3429534b0fc9ead0583a747dc2b3e2feb13c499e";
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true}));
  mongoose.connect('mongodb://localhost/ko_dev');
  configureAuth();
});

// Production Config
app.configure('production', function(){
  github_app_id = "b17b8384a0542123dba4";
  github_secret = "ad39b5adeee853ef85aa26223ceb217982b69e48";
  app.use(express.errorHandler());
  mongoose.connect('mongodb://localhost/ko_prod');
  configureAuth();
});

// General Config
app.configure(function() {
  app.register('.html', ejs);
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'html');

  app.use(express.cookieParser());
  app.use(express.session({ secret: "foobar" }));
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));

  app.use(everyauth.middleware());
});

// Auth
function configureAuth() {
  var User = require('./app/models/user');

  everyauth.github
    .appId(github_app_id)
    .appSecret(github_secret)
    .findOrCreateUser(function(session, accessToken, accessTokenExtra, githubUserMetadata) {
      var promise = this.Promise();
      User.find({git_id: githubUserMetadata.id}, function(err, user){ 
        if(err || user.length > 1) {
          return promise.fulfill([err || new Error("Too many users")]);
        }
        if(!user.length){
          User.create_user(accessToken, githubUserMetadata, function(user){
              promise.fulfill({id: user.id});
          });
        } else {
          promise.fulfill({id: user[0]._id});
        }
      });
      return promise;
    })
    .redirectPath('/projects');
}

/*
 * ROUTES
 */
var pagesController = require('./app/controllers/pages_controller');
var dashboardsController = require('./app/controllers/dashboards_controller');
var usersController = require('./app/controllers/users_controller');
var projectsController = require('./app/controllers/projects_controller');
var pullsController = require('./app/controllers/pull_controller');

pagesController.defineRoutes(app);
dashboardsController.defineRoutes(app);
usersController.defineRoutes(app);
projectsController.defineRoutes(app);
pullsController.defineRoutes(app);

if(!module.parent){
	
	var bot = {
		name: "Bender",
		avatar: "http://i.imgur.com/OArxv.jpg"
	};
	
  app.listen(port);
  var everyone = require("now").initialize(app);
  console.log("Started listening on port " + port);
	
	nowjs.on('connect', function(){
		this.now.user = {name: 'Anonymous', avatar: 'https://secure.gravatar.com/avatar/'+this.user.clientId+'?d=retro'};
		everyone.now.filterComeOnline(this.now.user, this.now.roomId);
	});
	
	nowjs.on('disconnect', function() {
		everyone.now.filterGoOffiline(this.now.user, this.now.roomId);
	});

  everyone.now.sendComment = function(pull_id, file, line, message){
    everyone.now.filterBroadcast(bot, "   New comment on line " + line + ": " + message, this.now.roomId);
    comment = new Comment();
    comment.pull_id = pull_id;
    comment.line = line;
    comment.login = this.now.user.name;
    comment.message = message;
    comment.save(function(err) {
      if (err) {
        console.log("shit, couldn't save the comment!");
      }
    });
  };
	everyone.now.filterComeOnline = function(user, targetRoomId){
    if(targetRoomId == this.now.roomId){
      this.now.renderComeOnline(user);
			this.now.receiveBroadcast(bot, user.name + " has come online.");
    }
	}
	
	everyone.now.filterGoOffiline = function(user, targetRoomId){
    if(targetRoomId == this.now.roomId){
      this.now.renderGoOffline(user);
			this.now.receiveBroadcast(bot, user.name + " has goen offline.");
    }
	}
	
  everyone.now.sendBroadcast = function(message){
    everyone.now.filterBroadcast(this.now.user, message, this.now.roomId);
  }

  everyone.now.updateUserInfo = function(secret_key) {
    var user = this.now.user;
    var Github = require('./lib/git_request');
    Github.get('/user?access_token='+secret_key, function(err, data) {
      user.name = data.login;
      user.avatar = "http://gravatar.com/avatar/"+data.gravatar_id;
    });
  }

  everyone.now.filterBroadcast = function(user, message, targetRoomId){
    if(targetRoomId == this.now.roomId){
      this.now.receiveBroadcast(user, message);
    }
  }
	
	everyone.now.sendPosition = function(position){
    everyone.now.filterPosition(this.now.user, position, this.now.roomId);
	}

  everyone.now.filterPosition = function(user, position, targetRoomId){
    if(targetRoomId == this.now.roomId){
      this.now.renderUserPosition(user, position);
    }
  }
}
