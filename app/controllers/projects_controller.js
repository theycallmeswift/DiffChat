var ProjectsController, exports, helper;

helpers = require(process.cwd() + '/lib/helper');

ProjectsController = function() {
  this.isAuthenticated = helpers.isAuthenticated;
}

ProjectsController.prototype.defineRoutes = function(app) {
  var self = this;
  
  app.get('/projects/top/?', self.isAuthenticated, function(req, res) {
    res.render('projects/top', {
      isLoggedIn: req.isLoggedIn,
      user: req.user.user
    });
  });

  /**
   * Shows a general list of projects with recent activity
   */
  app.get('/projects/?', self.isAuthenticated, function(req, res) {
    var Repo = require(process.cwd() + '/app/models/repo');
    if(req.isLoggedIn) {
      Repo.get_owned(req.user.accessToken, function(err, data) {
        res.render('projects/list', {
          isLoggedIn: req.isLoggedIn,
          user: req.user.user,
          projects: data,
          num_projects: data.length,
          user_name: req.user.user.login
        });
      });
    }
    else {
      res.redirect('/');
    }
  });

  app.post('/find_proj', function(req, res) {
    var Repo = require(process.cwd() + '/app/models/repo');
    Repo.checkUser(req.body.user.name, function(problem){
      if(!problem) { //sends message if there is a problem
        res.redirect('/projects/' + req.body.user.name);
      }
    });
  });

  app.get('/projects/:user_name/?', self.isAuthenticated, function(req, res){
    var Repo = require(process.cwd() + '/app/models/repo');
      Repo.userRepo(req.params.user_name, function(err, data) {
        res.render('projects/list', {
          isLoggedIn: req.isLoggedIn,
          user: req.user,
          projects: data,
          num_projects: data.length,
          user_name: req.params.user_name
        });
      });
  });

  //one project with details
  app.get('/projects/:user_name/:repo_name/?', self.isAuthenticated, function(req, res) {
    var Repo = require(process.cwd() + '/app/models/repo');
      var show_it = ['name', 'html_url', 'git_url'];
      Repo.getOne(req.params.user_name, req.params.repo_name, function (err, data){
        res.render('projects/repo', {
          isLoggedIn: req.isLoggedIn,
          user: req.user,
          repo: data,
          props: show_it,
          git_user: req.params.user_name //user name of repo being viewed
         });
      });
  });
};

exports = module.exports = new ProjectsController();
