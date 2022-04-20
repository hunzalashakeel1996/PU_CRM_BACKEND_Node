const User = require('../models/AzabModel');


exports.AzabReport = function (req, res, next) {

    User.AzabReport(req.body.data).then(data => {
        res.send(data)
    }).catch(err => {
        next(err)
    });
    
}



exports.insertRecord = function (req, res, next) {

    User.insertRecord(req.body.data).then(data => {
        res.send(data)
    }).catch(err => {
        next(err)
    });
    
}