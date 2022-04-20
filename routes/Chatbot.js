const express = require('express');
const router = express.Router();
const User = require('../controllers/ChatbotController');
const authAPI = require('../middleware/authAPI')

router.post('/chat', User.Chat);

module.exports = router;