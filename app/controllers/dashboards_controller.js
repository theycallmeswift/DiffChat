var Controller, DashboardsController, exports;

Controller = require(process.cwd() + '/lib/controller');

DashboardsController = function () {
  this.site_title = "LiveDiff";
  this.directory = "dashboards/";

  this.isAuthenticated = function(req, res, next) {
    console.log("Authenticating user");
    if (req.loggedIn) {
      console.log("User is logged in: " + req.session.auth.github.user.login);
      req.user = req.session.auth.github.user;
    } else {
      console.log("User not authenticated");
      req.user = false;
    }
    next();
  };
};

DashboardsController.prototype.defineRoutes = function(app) {
  var self = this;
  app.get('/dashboard', self.isAuthenticated, function(req, res) {
    res.render("" + self.directory + "/main", {
      title: "User Dashboard - " + self.site_title,
      user: req.user
    });
  });
};

exports = module.exports = new DashboardsController;
