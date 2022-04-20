const express = require('express');
const bodyParser = require('body-parser');
const login = require('../routes/login');
const ticket = require('../routes/ticket');
const azab = require('../routes/Azab')
const Chatbot = require('../routes/Chatbot')
const General = require('../routes/General')
// const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app){
  app.use(express.json());
  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
  // app.use('/api', createProxyMiddleware({ target: 'http://beu4uojtuot0pa:ikjkj3q9hmd8rmka5i9biap7hb2my@us-east-static-06.quotaguard.com:9293', changeOrigin: true }));

  app.use('/api/login', login)
  app.use('/api/ticket', ticket)
  app.use('/api/azab', azab) 
  app.use('/api/chatbot', Chatbot)
  app.use('/api/general', General)
}