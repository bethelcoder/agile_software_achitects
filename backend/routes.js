const express = require('express');
const router = express.Router();
const controller = require('./controller');


router.post('/login', controller.login); 

router.post('/logout', controller.logout);

// router.post('/add', controller.verifyToken, controller.addData);

module.exports = router;
