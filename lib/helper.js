var exports = module.exports;

exports.isAuthenticated = function(req, res, next) {
  req.isLoggedIn = false;
  req.user = { };

  if (req.loggedIn && req.session.auth.github) {
    console.log("Authenticating user: " + req.session.auth.github.user.login);
    req.isLoggedIn = true;
    req.user = req.session.auth.github;
  }

  next();
};
