const User = require('../models/ChatbotModel');
const fetch = require('node-fetch');

exports.Chat = function (req, res, next) {
    User.Chat(req.body.sentence).then(data => {
        res.send(data)
    }).catch(err => {
        next(err)
    });
    
}