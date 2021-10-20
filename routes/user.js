var express = require("express");
var router = express.Router();
const passport = require("./passport.js");
const userController = require("../controllers/userController.js");

router.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    console.log("log in ?")
    res.redirect("/");
  }
};

// GET request for User Profile page
router.get("/mypage", router.isAuthenticated, userController.mypage);

router.get("/login", userController.userlogin);

// GET request current user
router.get("/info", router.isAuthenticated, userController.userinfo);

router.get("/logout", userController.userlogout);

// 'GET returnURL'
// `passport.authenticate` will try to authenticate the content returned in
// query (such as authorization code). If authentication fails, user will be
// redirected to '/' (home page); otherwise, it passes to the next middleware.
router.get(
  "/auth/openid/return",
  function(req, res, next) {
    passport.authenticate("azuread-openidconnect", {
      response: res, // required
      failureRedirect: "/"
    })(req, res, next);
  },
  function(req, res) {
    console.log("We received a return from AzureAD.");
    res.redirect("/user/mypage");
  }
);

// 'POST returnURL'
// `passport.authenticate` will try to authenticate the content returned in
// body (such as authorization code). If authentication fails, user will be
// redirected to '/' (home page); otherwise, it passes to the next middleware.
router.post(
  "/auth/openid/return",
  function(req, res, next) {
    passport.authenticate("azuread-openidconnect", {
      response: res, // required
      failureRedirect: "/"
    })(req, res, next);
  },
  function(req, res) {
    console.log("We received a return from AzureAD.");
    res.redirect("/user/mypage");
  }
);

module.exports = router;
