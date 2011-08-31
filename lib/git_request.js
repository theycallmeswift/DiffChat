var https = require('https');

//GET functionality
exports = module.exports;

exports.get = exports.getGit = function(poll_path, cb){

  var options = {
    host: 'api.github.com',
    path: poll_path
  };

  var req = https.get(options, function(res) {
    var pulls;
    var pull_str = "";

    //add data as it comes in
    res.on('data', function(d) {
      pull_str += d;
    });

    //once we get it all, json it and send it
    res.on('end', function() {
      pulls = JSON.parse(pull_str);
      cb(null, pulls); //send it back
    });
  });

  req.on('error', function(e) {
    cb(new Error("could not get repo's list"));
  });
};
