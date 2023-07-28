const express = require('express');
const router = express.Router();
const getUsrPayment = require('../controllers/paymentsController');


router.post('/payment', getUsrPayment);

module.exports = router;
