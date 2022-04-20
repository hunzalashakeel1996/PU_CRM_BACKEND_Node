const jwt = require('jsonwebtoken')
const { jwtKey } = require('../config');
const jwtDecode = require('jwt-decode');

module.exports = function(req, res, next) {
  const token = req.header('jsonwebtoken');
  console.log('header', token)
  console.log('header 2', jwtKey)
  if(!token)
    return res.status(401).send('Access denied. No Token provided.')
  try{
    console.log('aaaaa')
    const decoded = jwt.verify(token, jwtKey)
    next();
  }
  catch(ex){
    console.log('innnnnn')
    res.status(400).send('Invalid Token')
  }
}