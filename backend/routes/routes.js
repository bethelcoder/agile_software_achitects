const { Router } = require('express');
const router = Router();
const controllers = require('../controller/controller');
const passport = require('passport');
const User = require('../firebase/config/firebase');


router.get('/register', controllers.regPage);
router.get('/login', controllers.logPage);
router.get('/submit-username', (req, res) => {
  res.redirect('/');
});
router.post('/submit-username', controllers.submitUsername);

// -------- 3rd part IdP Authentication
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'] // These are the data we want access to from the user
  })); 

router.get('/github', passport.authenticate('github', {
  scope: ['profile', 'email'] // These are the data we want access to from the user
})); 

// -------- 3rd party IdP Callbacks
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  async (req, res) => {
    const googleId = req.user.id;
    try {
      const userDoc = await User.collection('users').doc(googleId).get();

      if (userDoc.exists) {
        const userName = userDoc.data().userName;
        // User already exists → redirect to welcome
        res.render('welcome', { userName });
      } else {
        res.redirect('/g-profile');
      }
    } catch (error) {
        console.error('Error checking user existence:', error);
        res.status(500).send("Error!");
    }
  }
);

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/github' }),
  async (req, res) => {
    const githubId = req.user.id;
    try {
      const userDoc = await User.collection('users').doc(githubId).get();

      if (userDoc.exists) {
        const userName = userDoc.data().userName;
        // User already exists → redirect to welcome
        res.render('welcome', { userName });
      } else {
        res.redirect('/github-profile');
      }
    } catch (error) {
        console.error('Error checking user existence:', error);
        res.status(500).send("Error!");
    }
  }
);



module.exports = router;