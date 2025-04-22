const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
require('dotenv').config();
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
app.use(express.json());
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => console.error("❌ MongoDB connection error:", err));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'frontend', 'view'));
app.use(express.static('public'));
app.use("/config", express.static("config"));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }));

  
  // Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

require('./backend/api/passport');
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});


const userRoutes = require('./backend/routes/routes');
app.use('/auth', userRoutes);       
app.use('/users', userRoutes);      


app.get('/g-profile', (req, res) => {
  const googleId = req.user.profile.id;
  req.session.tempUser = { userId: googleId };
  res.render('usernamepage');
});

app.get('/github-profile', (req, res) => {
  const githubId = req.user.profile.id;
  req.session.tempUser = { userId: githubId };
  res.render('usernamepage');
});

app.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
      console.error("Logout error:", err);
      return res.redirect('/error');
    }

    req.session.destroy((err) => {
      if (err) console.error("Session destruction error:", err);
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});


app.get('/', (req, res) => {
  res.render('landingPage');
});


app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

module.exports = app;
