var helpers, PagesController, exports;

helpers = require(process.cwd() + '/lib/helper');

PagesController = function() {
  this.isAuthenticated = helpers.isAuthenticated;
}

PagesController.prototype.defineRoutes = function(app) {
  var self = this;

  app.get('/', self.isAuthenticated, function(req, res) {
    res.render("pages/index", {
      title: "Home - " + self.site_title,
      isLoggedIn: req.isLoggedIn,
      user: req.user
    });
  });

  app.get('/pages/about', self.isAuthenticated, function(req, res) {
    res.render("pages/about", {
      title: "About Us - " + self.site_title,
      isLoggedIn: req.isLoggedIn,
      user: req.user
    });
  });
};

exports = module.exports = new PagesController();
