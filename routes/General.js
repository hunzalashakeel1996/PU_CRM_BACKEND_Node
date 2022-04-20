const express = require('express');
const router = express.Router();
const User = require('../controllers/GeneralController');
const authAPI = require('../middleware/authAPI')

// router.post('/azabReport', authAPI, User.AzabReport);
router.post('/getVendorname', User.getVendorname);

module.exports = router;