const { Router } = require('express');
const router = Router();
const controllers = require('../controller/controller');

router.get('/register', controllers.regPage);
router.get('/login', controllers.logPage);



module.exports = router;