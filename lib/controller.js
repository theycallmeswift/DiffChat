(function() {
  var Controller, exports;
  Controller = (function() {
    function Controller() {
      this.site_title = "LiveDiff";
    }
    Controller.prototype.isAuthenticated = function(req, res, next) {
      if (req.loggedIn) {
        console.log("Authenticating user: " + req.session.auth.github.user.login);
        req.user = req.session.auth.github.user;
        return next();
      } else {
        return res.redirect('/');
      }
    };
    Controller.prototype.sayHello = function() {
      return console.log(hello);
    };
    return Controller;
  })();
  exports = module.exports = Controller;
}).call(this);
