const User = require('../models/ticketModel');

exports.addTicket = function (req, res, next) {
    User.addTicket(req.body.data).then(data => {
        res.send(data)
    }).catch(err => {
        next(err)
    });
}

exports.getTickets = function (req, res, next) {
    console.log('123123')
    User.getTickets(req.body.data).then(data => {
        res.send(data)
    }).catch(err => {
        next(err)
    });
}

exports.addComment = function (req, res, next) {
    User.addComment(req.body.data).then(data => {
        res.send(data)
    }).catch(err => {
        next(err)
    });
}

exports.addReminder = function (req, res, next) {
    User.addReminder(req.body.data).then(data => {
        res.send(data)
    }).catch(err => {
        next(err)
    });
}

exports.getComments = function (req, res, next) {
    User.getComments(req.body.data).then(data => {
        res.send(data)
    }).catch(err => {
        next(err)
    });
}

exports.onStatusChange = function (req, res, next) {
    User.onStatusChange(req.body.data).then(data => {
        res.send(data)
    }).catch(err => {
        next(err)
    });
}

exports.getUserReminders = function (req, res, next) {
    User.getUserReminders(req.body.data).then(data => {
        res.send(data)
    }).catch(err => {
        next(err)
    });
}

exports.getDeparts = function (req, res, next) {
    User.getDeparts().then(data => {
        res.send(data)
    }).catch(err => {
        next(err)
    });
}

exports.getTicketDetail = function (req, res, next) {
    User.getTicketDetail(req.body.data).then(data => {
        res.send(data)
    }).catch(err => {
        next(err)
    });
}
//
exports.reminderStatusChange = function (req, res, next) {
    User.reminderStatusChange(req.body.data).then(data => {
        res.send(data)
    }).catch(err => {
        next(err)
    });
}

//
exports.getCustomerDetail = function (req, res, next) {
    User.getCustomerDetail(req.body.data).then(data => {
        res.send(data)
    }).catch(err => {
        next(err)
    });
}

exports.TicketStatusChange = function (req, res, next) {
    User.TicketStatusChange(req.body.data).then(data => {
        res.send(data)
    }).catch(err => {
        next(err)
    });
}

exports.insertDeviceToken = function (req, res, next) {
    User.insertDeviceToken(req.body.data).then(data => {
        res.send(data)
    }).catch(err => {
        next(err)
    });
}

exports.userRemindersOnStatus = function (req, res, next) {
    User.userRemindersOnStatus(req.body.data).then(data => {
        res.send(data)
    }).catch(err => {
        next(err)
    });
}

exports.imageUpload = function (req, res, next) {
    res.json(req.file.path)
    // User.reminderStatusChange(req.body.data).then(data => {
    //     res.send(data)
    // }).catch(err => {
    //     next(err)
    // });
}

