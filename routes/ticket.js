const express = require('express');
const router = express.Router();
const User = require('../controllers/ticketController');
const authAPI = require('../middleware/authAPI')

const multer  = require('multer')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    console.log('1111')

        cb(null, 'assets/uploads')
    },
    filename: function (req, file, cb) {
        // You could rename the file name
        // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        console.log('2222')

        // You could use the original name
        cb(null, file.originalname)
    }
});

var upload = multer({storage: storage})


router.post('/addTicket', authAPI, User.addTicket);
router.post('/getTickets', authAPI, User.getTickets);
router.post('/addComment', authAPI, User.addComment);
router.post('/addReminder', authAPI, User.addReminder);
router.post('/getComments', authAPI, User.getComments);
router.post('/onStatusChange', authAPI, User.onStatusChange);
router.post('/getUserReminders', authAPI, User.getUserReminders);
router.post('/getDeparts', User.getDeparts);
router.post('/getTicketDetail', authAPI, User.getTicketDetail);
router.post('/reminderStatusChange', authAPI, User.reminderStatusChange);
router.post('/getCustomerDetail', authAPI, User.getCustomerDetail);
router.post('/imageUpload', upload.single("CRMImage"), User.imageUpload);
router.post('/TicketStatusChange', authAPI, User.TicketStatusChange);
router.post('/insertDeviceToken', authAPI, User.insertDeviceToken);
router.post('/userRemindersOnStatus', authAPI, User.userRemindersOnStatus);
// router.post('/codeVerification', User.codeVerification);
// router.post('/passwordLogin', User.passwordLogin);
// router.post('/Resend', User.Resend);


module.exports = router;