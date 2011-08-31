var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var gitCall = require('../../lib/git_request');
var Repo = require('./repo');

var PullSchema = new Schema({
  diff_url: {type: String},
  number: {type: String},
  state: {type: String},
  title: {type: String},
  body: {type: String},
  created_at: {type: Date, default: Date.now()},
  updated_at: {type: Date, default: Date.now()},
  comments: {type: Number, default: 0},
  repo_name: {type: String},
  owner_name: {type: String}
});

var Pull = module.exports = mongoose.model('Pull', PullSchema);

function createPull(pull, user_name, repo_name){

   var new_pull = new Pull();
    new_pull.diff_url = pull.diff_url;
    new_pull.number = pull.number;
    new_pull.state = pull.state;
    new_pull.title = pull.title;
    new_pull.body = pull.body;
    new_pull.created_at = pull.created_at.replace(/[A-Z]/g, ' ');
    new_pull.updated_at = pull.updated_at.replace(/[A-Z]/g, ' ');
    new_pull.comments = pull.comments;
    new_pull.repo_name = repo_name;
    new_pull.owner_name = user_name;
    return new_pull;

}

function getOnePull(user_name, repo_name, id, callback){
  console.log( '/repos/' + user_name + '/' + repo_name + '/pulls/' + id);
  gitCall.get('/repos/' + user_name + '/' + repo_name + '/pulls/' + id, function(error, res){
      if(error){
        console.log("Problem");
      } 
      callback(null, res);
  }); 
};

//given repo name, find all pulls
module.exports.getPulls = function(user_name, repo_name, callback){
  var temp = Pull.find({'repo_name': repo_name, 'owner_name': user_name}).sort('number', -1).limit(10).execFind(function(err, docs) {
    if(err) {
      console.log("passed in based name");
    } //else { //show only be one response, so just take the first one
       //console.log(docs); 
    //}
  });

  return temp;

};

//get new pulls
module.exports.getNewPulls = function(user_name, repo_name, callback) {
  var count = 0;
  var full_data = [];
  gitCall.get('/repos/' + user_name + '/' + repo_name + '/pulls', function(err, data) {
      if(err) {
        console.log(err);
      }
      callback(null, data);
      /*data.forEach( function(one_pull) {
      getOnePull(user_name, repo_name, one_pull.number, function(one_piece){
        count++;
        full_data.push(one_piece);
        if(count === data.length){
          callback(null, full_data);
        }
      });      
    });*/
  });
};
