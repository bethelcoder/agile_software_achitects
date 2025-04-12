//app config
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
app.use(express.json());
const passport = require('passport');
const session = require('express-session');

const User= require('./backend/api/database');
const PORT = process.env.PORT || 4000;

// View and static config
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'frontend', 'view'));//if views is located in another folder called frontend!!
app.use(express.static('public'));
app.use("/config", express.static("config"));
const userRoutes = require('./backend/routes/routes');
require('./backend/api/passport');
// Session setup
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  }));
  
  // Initialize passport and session
  app.use(passport.initialize());
  app.use(passport.session());
  
//   passport.use (
//     new GoogleStrategy({
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: 'http://localhost:4000/auth/google/callback',
//     }, (accessToken, refreshToken, profile, done) => {
//         return done(null, profile);
//     }
//     )
//   );

//   passport.serializeUser((user, done) => done(null, user));
//   passport.deserializeUser((user, done) => done(null, user));
  
  // Google authentication routes
    app.use('/auth', userRoutes);

    app.get('/profile', (req, res) => {

        console.log(req.user);
        const data= {
          userId: req.user.id
        }
        User.add(data);
        res.send(`Welcome ${req.user.displayName}`);
    })

    app.get("/logout", (req, res) => {
        req.logOut();
        res.redirect("/");
    })

app.get('/', (req, res) => {
    res.render('index');
});

app.use('/users', userRoutes);
app.listen(PORT, () => console.log(`Running on localhost:${PORT}`));