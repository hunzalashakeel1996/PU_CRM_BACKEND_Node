const User = require('../models/GeneralModel');


// exports.AzabReport = function (req, res, next) {

//     User.AzabReport(req.body.data).then(data => {
//         res.send(data)
//     }).catch(err => {
//         next(err)
//     });
    
// }



exports.getVendorname = function (req, res, next) {

    User.getVendorname(req.body.data).then(data => {
        res.send(data)
    }).catch(err => {
        next(err)
    });
    
}