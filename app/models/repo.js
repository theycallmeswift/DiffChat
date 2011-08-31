var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var https = require('https');
var Github = require('../../lib/git_request');

var RepoSchema = new Schema({
  repo_id: {type: String},
  html_url: {type: String},
  name: {type: String},
  owner_name: {type: String},
  desc: {type: String},
  homepage: {type: String},
  created_at: {type: Date, default: Date.now()},
  updated_at: {type: Date, default: Date.now()}
});

var Repo = module.exports = mongoose.model('Repo', RepoSchema);

Repo.get_owned = function (secret, cb) {
  Github.get('/user/repos?access_token=' + secret, function(err, data) {

  //Github.get('/users/repos/', function(err, data) {
    if(err) {
      cb(err);
    }

    cb(null, data);
  });
};


Repo.getOne = function(user_id, repo_id, cb){
  Github.get('/repos/' + user_id + '/' + repo_id, function(err, data){
    if(err){
      cb(err);
    } 
    cb(null, data);
   });
};

Repo.userRepo = function(user_name, cb){
  Github.get('/users/' + user_name + '/repos', function(err, data){
    if(err){
      cb(err);
    }
    cb(null, data);
  })
};

Repo.checkUser = function(user_name, cb){
  Github.get('/users/' + user_name, function(err, data){
    cb(err || data.message);
  });
};
