var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  github_username: {type: String},
  gravitar_id: {type: String},
  user_type: {type: String, default: "basic"},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  github_id: {type : Number},
  access_token: {type: String},
});

var User = module.exports = mongoose.model('User', UserSchema);

User.create_user = function(access_token, metadata, cb){
  // create user given id and login
  var user = new User();
  user.github_username = metadata.login;
  user.gravitar_id = metadata.gravitar_id;
  user.github_id = metadata.id;
  user.access_token = access_token;
  user.save(function (err){
    cb(this);
  });
}

