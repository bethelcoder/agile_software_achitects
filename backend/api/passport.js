const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;


  passport.use (
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'https://freelancestudio-hzafgne9ethfgfb0.southafricanorth-01.azurewebsites.net/auth/google/callback',
    }, (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
    }
    )
  );
  passport.use(
    new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:'http://localhost:4000/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    })
  );

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
