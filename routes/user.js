var express = require("express");
var router = express.Router();
const passport = require("./passport.js");
const userController = require("../controllers/userController.js");

router.isAuthenticated = function(req, res, next) {
  if (req.user) return next();
  else res.redirect("/user/login");
};

// GET request for User Profile page
router.get("/mypage", router.isAuthenticated, userController.mypage);

router.get("/login", userController.userlogin);

// GET request current user
router.get("/info", router.isAuthenticated, userController.userinfo);

router.get("/logout", userController.userlogout);

//User Login Post
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/user/mypage",
    failureRedirect: "/user/login"
  })
);

module.exports = router;
