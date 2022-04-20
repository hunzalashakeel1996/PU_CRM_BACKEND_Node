const express = require('express');
const router = express.Router();
const User = require('../controllers/AzabController');
const authAPI = require('../middleware/authAPI')

router.post('/azabReport', authAPI, User.AzabReport);
router.post('/insertRecord', authAPI, User.insertRecord);

module.exports = router;