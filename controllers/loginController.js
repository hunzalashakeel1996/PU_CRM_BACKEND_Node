const User = require('../models/loginModel');

exports.login = function (req, res, next) {
    console.log('indei 2')
    User.login(req.body.data).then(data => {
        res.send(data)
    }).catch(err => {
        next(err)
    });
}

exports.logout = function (req, res, next) {
    User.logout(req.body.data).then(data => {
        res.send(data)
    }).catch(err => {
        next(err)
    });
}
