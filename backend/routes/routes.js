const { Router } = require('express');
const router = Router();
const controllers = require('../controller/controller');
const passport = require('passport');


router.get('/register', controllers.regPage);
router.get('/login', controllers.logPage);

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'] // These are the data we want access to from the user
  })); 

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/profile');
  }
);
  


module.exports = router;