const { Router } = require('express');
const router = Router();
const controllers = require('../controller/controller');
const passport = require('passport');
const User = require('../api/mongoDB/User');
const middleware = require('../middlewares');


router.get('/register', controllers.regPage);
router.get('/login', controllers.logPage);



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



module.exports = router;