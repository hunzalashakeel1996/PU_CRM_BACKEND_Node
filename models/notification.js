const { F_API_KEY } = require('../config');
const fetch = require('node-fetch');

const authKey = `key=${F_API_KEY}`;
const header = {
  Accept: 'application/json',
  "Content-Type": "application/json",
  "Authorization": authKey,
};

const sendNotification = (title, message, tokens, data = {}, actions = []) => {
  console.log(authKey)
  fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: header,
    body: JSON.stringify({
      notification: {
        title: title,
        // image: 'https://firebase.google.com/images/social.png',
        body: message,
      },
      data,
      priority: "high",
      registration_ids: tokens
    })
  }).then(res => {
    return res.json()
  }).then(res => {
    console.log('notifcation res', res)

  })
  
}

const sendSilentNotification = (tokens, data = {}) => {
    return fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: header,  
      body: JSON.stringify({
        data,
        priority: "high",
        registration_ids: tokens
      })
    }).then(res => { return res.json() })
}

module.exports = { sendNotification, sendSilentNotification };