var passport = require("passport");
var OIDCStrategy = require("passport-azure-ad").OIDCStrategy;
const mysql = require("../models/sql.js");
const config = require("../config");

passport.use(
  new OIDCStrategy(
    {
      identityMetadata: config.creds.identityMetadata,
      clientID: config.creds.clientID,
      responseType: config.creds.responseType,
      responseMode: config.creds.responseMode,
      redirectUrl: config.creds.redirectUrl,
      allowHttpForRedirectUrl: config.creds.allowHttpForRedirectUrl,
      clientSecret: config.creds.clientSecret,
      validateIssuer: config.creds.validateIssuer,
      isB2C: config.creds.isB2C,
      issuer: config.creds.issuer,
      passReqToCallback: config.creds.passReqToCallback,
      scope: config.creds.scope,
      //loggingLevel: config.creds.loggingLevel,
      nonceLifetime: config.creds.nonceLifetime,
      nonceMaxAmount: config.creds.nonceMaxAmount,
      useCookieInsteadOfSession: config.creds.useCookieInsteadOfSession,
      cookieEncryptionKeys: config.creds.cookieEncryptionKeys,
      clockSkew: config.creds.clockSkew
    },
    function(iss, sub, profile, accessToken, refreshToken, done) {
      if (!profile.oid) {
        return done(new Error("No oid found"), null);
      }
      // asynchronous verification, for effect...
      process.nextTick(function() {
        //console.log(profile);
        mysql.getUser(profile.oid, function(err, user) {
          console.log(user);
          if (err) {
            return done(err);
          }
          if (!user) {
            console.log("user is not in database");
            return done(null, {
              UNAME: profile.displayName,
              USER_ID: profile.oid
            });
          }
          return done(null, user);
        });
      });
    }
  )
);

passport.serializeUser(function(user, cb) {
  console.log("user is", user, cb);
  cb(null, user);
});

passport.deserializeUser(function(cuser, done) {
  mysql.getUserDetails(cuser.USER_ID, function(err, user) {
    if (!user) done(null, cuser);
    else done(err, user);
  });
});

module.exports = passport;
