/* ------> User Controller */

exports.mypage = function(req, res, next) {
  res.render("mypage", { user: req.user });
};

exports.userlogin = function(req, res, next) {
  if (req.user) res.redirect("mypage");
  else res.render("login");
};

exports.userlogout = function(req, res, next) {
  req.logout();
  res.redirect("/");
};

exports.userinfo = function(req, res, next) {
  res.send(req.user);
};
