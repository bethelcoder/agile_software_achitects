const express = require('express');
const router = express.Router();
const passport = require('passport');
const controller = require('../controller/controller');
const User = require('../api/mongoDB/User');
const middleware = require('../middlewares');


router.get('/register', controller.regPage);
router.get('/login', controller.logPage);

router.get('/dashboard', async (req, res) => {
  const userID = req.user.profile.id;
  const userDoc = await User.findOne({ userID });
  const userName = userDoc.userName;
  const userRole = userDoc.roles;

  if (userRole.length == 1 && userRole[0] == "client") {
    res.render('clientDashboard', { userName });
  } else if (userRole.length > 1) {
    res.render('welcome', { userName });
  } else {
    res.send('Something went wrong with user roles.');
  }
});

router.post('/submit-username', controller.submitUsername);
router.get('/submit-username', (req, res) => {
  res.redirect('/');
});


// 3rd Party Login: Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  async (req, res) => {
    const userID = req.user.profile.id;
    try {
      const userDoc = await User.findOne({ userID });


      if (userDoc) { 
          const userName = userDoc.userName;
          const userRole = userDoc.roles;
          if(userRole.length == 1){
              if(userRole[0] == "client") {
                // res.render('clientDashboard', { userName });
                res.redirect('/users/dashboard');
              } else {
                res.json({message: "Landend here instead"});
              }
          } else {
              res.render('welcome', { userName });
          }
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
    const userID = req.user.profile.id;
    try {
      const userDoc = await User.findOne({ userID });


      if (userDoc) { 
          const userName = userDoc.userName;
          const userRole = userDoc.roles;
          if(userRole.length == 1){
              if(userRole[0] == "client") {
                res.redirect('/users/dashboard');
              } else {
                res.json({message: "Landend here instead"});
              }
          } else {
              res.render('welcome', { userName });
          }
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
