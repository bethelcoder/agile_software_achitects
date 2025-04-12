const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Your Google credentials
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Set up the Google OAuth2 strategy
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/callback", 
  },
  (accessToken, refreshToken, profile, done) => {
    // This function gets called after the user logs in with Google
    console.log(profile); // The profile contains the user's info
    return done(null, profile); 
  }
));

// Serialize and deserialize user info
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
