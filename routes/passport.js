var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const mysql = require("../models/sql.js");

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "userpass"
    },
    function(username, password, cb) {
      mysql.getUser(username, password, function(err, user) {
        if (err) {
          console.log(err);
          return cb(err);
        }
        if (!user) {
          return cb(null, false);
        }
        if (user.UPASS != password) {
          return cb(null, false);
        }
        return cb(null, user);
      });
    }
  )
);

passport.serializeUser(function(user, cb) {
  cb(null, user.USER_ID);
});

passport.deserializeUser(function(id, cb) {
  mysql.getUserDetails(id, function(err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

module.exports = passport;
