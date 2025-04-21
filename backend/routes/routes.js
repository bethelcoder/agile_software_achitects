const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../controller/controller');
const User = require('../api/mongoDB/User');


router.get('/register', controller.regPage);
router.get('/login', controller.logPage);

router.get('/submit-username', (req, res) => {
  res.redirect('/');
});
router.post('/submit-username', controller.submitUsername);

// 3rd Party Login: Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  async (req, res) => {
    const userID = req.user.id;
    try {
      const userDoc = await User.findOne({ userID });
      if (userDoc) {
        const userName = userDoc.userName;
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

// 3rd Party Login: GitHub
router.get('/github', passport.authenticate('github', {
  scope: ['profile', 'email']
}));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/github' }),
  async (req, res) => {
    const userID = req.user.id;
    try {
      const userDoc = await User.findOne({ userID });
      if (userDoc) {
        const userName = userDoc.userName;
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

router.get('/projects/:status', controller.getProjectsByStatus);
router.post('/projects', controller.createProject);
router.get('/applications/:freelancerId', controller.getApplicationsByFreelancer);
router.post('/applications', controller.createApplication);
router.get('/projects/clients',controller.getPostedProjectsByClients)

module.exports = router;
