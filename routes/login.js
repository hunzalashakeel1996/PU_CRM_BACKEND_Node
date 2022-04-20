const express = require('express');
const router = express.Router();
const User = require('../controllers/loginController');

router.post('/', User.login);
router.post('/logout', User.logout);
// router.post('/codeVerification', User.codeVerification);
// router.post('/passwordLogin', User.passwordLogin);
// router.post('/Resend', User.Resend);
//

module.exports = router;