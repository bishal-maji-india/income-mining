const express = require('express');
const router = express.Router();
const register = require('../controllers/userController');
const getChildNodes = require('../controllers/userController');


router.post('/register', register);
router.post('/getChildNodes',getChildNodes);
module.exports = router;
