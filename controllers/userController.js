/* ------> User Controller */

const passport = require("../routes/passport.js");

exports.mypage = function(req, res, next) {
  res.render("mypage", { user: req.user });
};

exports.userlogin = function(req, res, next) {
    passport.authenticate('azuread-openidconnect', 
      { 
        response: res,                      // required
        //resourceURL: config.resourceURL,    // optional. Provide a value if you want to specify the resource.
        customState: 'my_state',            // optional. Provide a value if you want to provide custom state value.
        failureRedirect: '/' 
      }
    )(req, res, next);
  },
  function(req, res) {
    console.log('Login was called in the Sample');
    res.redirect('/');
};

exports.userlogout = function(req, res, next) {
  req.logout();
  res.redirect("/");
};

exports.userinfo = function(req, res, next) {
  res.send(req.user);
};
