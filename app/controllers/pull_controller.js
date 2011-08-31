var PullController, exports;
var Pull = require('../models/pull');
var helpers = require(process.cwd() + '/lib/helper');

PullController = function() {
  this.isAuthenticated = helpers.isAuthenticated;
};

PullController.prototype.defineRoutes = function(app) {
  var self = this;

  //app.get('/repos/:user_id/:repo_id/pull', function(req, res) {
    //console.log('given user and repo, get pull requests');
    //Pull.getPulls(req.params.user_id, req.params.repo_id);
  //});

  app.get('/projects/:user_id/:repo_id/pulls/?', self.isAuthenticated, function(req, res) {
    var Repo = require(process.cwd() + '/app/models/repo');
    Repo.getOne(req.params.user_id, req.params.repo_id, function(error, repo_info){
      if(!error){
        Pull.getNewPulls(req.params.user_id, req.params.repo_id, function(err, data){
        res.render('projects/pull', {
          isLoggedIn: req.isLoggedIn,
          user: req.params.user_id,
          repo: req.params.repo_id,
          repo_data: repo_info,
          pulls: data,
        });
      }); 
    }
  });
});


  app.get('/projects/:github_user/:repository/pulls/:pull_number/?', self.isAuthenticated, function(req, res) {
    var github_user = req.params.github_user;
    var repository = req.params.repository;
    var pull_number = req.params.pull_number;
    var pull_id = [github_user, repository, pull_number].join(':');

    var DiffParser = require(process.cwd() + '/lib/parseDiff');

    DiffParser('https://github.com/'+github_user+'/'+repository+'/pull/'+pull_number+'.diff', function(err, data) {
      res.render('pulls/show', {
        title: "Viewing Pull #" + pull_number + " for " + repository,
        user: req.user,
        pull_id: pull_id,
        isLoggedIn: req.isLoggedIn,
        pull_data: {
          number: pull_number,
          diff: data,
        }
      });
    });
  });
};

exports = module.exports = new PullController;
