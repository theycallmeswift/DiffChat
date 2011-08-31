var UsersController, exports, helpers, User;

User = require('../models/user.js');
helpers = require(process.cwd() + '/lib/helper');

UsersController = function() {
  this.site_title = "LiveDiff";
  this.isAuthenticated = helpers.isAuthenticated;
};

UsersController.prototype.defineRoutes = function(app) {
  var self = this;
  app.get("/users/current/?", self.isAuthenticated, function(req, res) {
    var salt = "";
    if(req.isLoggedIn) {
      salt = req.user.accessToken;
    }
    res.send(salt);
  });
};

exports = module.exports = new UsersController();
