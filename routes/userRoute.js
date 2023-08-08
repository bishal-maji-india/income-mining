const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validateToken = require('../middleware/tokenValidateHandler');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/getChildNodes', userController.getChildNodes);
router.post('/assignUplineId', userController.assignUplineId);
router.get('/current',validateToken,userController.currentUser)

module.exports = router;
