const express = require('express');
const router = express.Router();
const register = require('../controllers/userController');
const getChildNodes = require('../controllers/userController');
const assignUplineId = require('../controllers/userController');




router.post('/register', register);
router.post('/getChildNodes',getChildNodes);
router.post('/assignUplineId',assignUplineId);

module.exports = router;
