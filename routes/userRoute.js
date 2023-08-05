const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/getChildNodes', userController.getChildNodes);
router.post('/assignUplineId', userController.assignUplineId);
module.exports = router;
