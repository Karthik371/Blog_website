const GoogleStrategy = require("passport-google-oauth2").Strategy;
const mongoose = require("mongoose");
const { Login, User } = require("../models/Users");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRECT,
        callbackURL: "http://localhost:3000/auth/google/main",
        passReqToCallback: true,
      },
      function (request, accessToken, refreshToken, profile, done) {
        Login.findOne({ googleId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    Login.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
