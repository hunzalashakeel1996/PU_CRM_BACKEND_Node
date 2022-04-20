const express = require('express');
const { sendNotification } = require('./models/notification');
const app = express();
const server = require('http').createServer(app);
var cors = require('cors')
const cron = require('node-cron');
const fetch = require('node-fetch');
const sql = require('./models/db')
const { google } = require('googleapis');
const queryParse = require('query-string')
const urlParse = require('url-parse')
const { Base64 } = require('js-base64');
const fs = require('fs');
const uuidv4 = require('uuid/v4');
const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

app.use(cors())
require('./startup/routes')(app);

//code
// 4/0AY0e-g7cSI-h0sYcQt-oDSeuM8lf5lPlw69ct3rdQXAQWJoO7M4dTwG8njSBWqFkwuiP7g

app.get('/', (req, res) => {
  res.send('hello')
  // const oauth2Client = new google.auth.OAuth2(
  //   // client id 
  //   "539977579692-cc8b7bnnbq6q9tgabeqsf26p3c8kr6pb.apps.googleusercontent.com",
  //   // client secret 
  //   "_lj2Fz4V3LngT0V1JZOuejsx",
  //   // link to redirect to
  //   "http://localhost:3000/steps"
  // )
  // const SCOPES = ['https://mail.google.com/'];

  // const url = oauth2Client.generateAuthUrl({
  //   access_type: 'offline',
  //   scope: SCOPES,
  //   state: JSON.stringify({
  //     callbackUrl: req.body.callbackUrl,
  //     userID: req.body.userid
  //   })
  // })

  // fetch(url, {
  //   method: 'GET',
  //   header: {
  //     Accept: 'application/json',
  //     "Content-Type": "application/json",
  //   }
  // }).then(temp => {
  //   console.log('notification temp', temp.status)
  //   res.send(url)
  // })

  // not this 
  // fetch(url, (err, response, body) => {
  //   console.log('error', err)
  //   console.log('state', response && response.statusCode)
  //   res.send({url})
  // })
})

app.get('/steps', async (req, res) => {
  const queryURL = new urlParse(req.url)
  const code = queryParse.parse(queryURL.query).code
  const oauth2Client = new google.auth.OAuth2(
    // client id 
    "539977579692-cc8b7bnnbq6q9tgabeqsf26p3c8kr6pb.apps.googleusercontent.com",
    // client secret 
    "_lj2Fz4V3LngT0V1JZOuejsx",
    // link to redirect to
    "http://localhost:3000/steps"
  )
  const tokens = await oauth2Client.getToken(code)
  try {
    // fetch(`https://gmail.googleapis.com/gmail/v1/users/hunzalashakeel1996@gmail.com/profile`, {
    //   method: 'GET',
    //   headers: {
    //     Accept: 'application/json',
    //     "Content-Type": "application/json",
    //     authorization: `Bearer ${tokens.tokens.access_token}` 
    //   },
    // }).then(response => {
    //   return response.json()
    // }).then(response => {
    //   console.log(response)
    //   res.send(response)
    // })
    let base64Data = `From: Hunzala Shakeel <hunzalashakeel1996@gmail.com> To: Mary Smith <hunzalashakeel1996@gmail.com> Subject: Saying Hello This is a message just to say hello. So, "Hello".`
    base64Data = Base64.encode(base64Data);
    console.log(base64Data)
    fetch(`https://gmail.googleapis.com/gmail/v1/users/hunzalashakeel1996@gmail.com/messages/send`, {
      method: 'POST',
      headers: {
        "HTTP-Version": "HTTP/1.1",
        Accept: 'application/json',
        "Content-Type": "application/json",
        authorization: `Bearer ${tokens.tokens.access_token}`
      },
      data: JSON.stringify({ raw: base64Data })
    }).then(response => {
      return response.json()
    }).then(response => {
      console.log(response)
      res.send(response)
    }).catch(e => {
      console.log('erroir', e)
    })
  } catch (e) {
    console.log('erroir22', e)
  }
})

cron.schedule('*/15 * * * *', () => {
  console.log('cron job task')
  const query = `exec STP_cron_reminder`;
  sql.queryRun(query, (err, res) => {
    if (err) {
      return err;
    } else {
      if (res.recordset.length > 1) {
        res.recordset.map(reminder => {
          sendNotification(`Reminder Alert`, `${reminder.Message}`,
            reminder.Token.split('-crm-'), { url: `https://pu-crm.herokuapp.com/admin/ticket/viewReminders`, ReminderID: reminder.ReminderID },
          )
        })
      }
      return res;
    }
  });
}, {
  timezone: "Asia/Karachi"
});

const port = process.env.PORT || 3005;
server.listen(port, () => {
  // const config = {
  //       publicKeyId: 'SANDBOX-AFGKMIPFXQBNP4LYYTVSB57G',
  //       privateKey: fs.readFileSync('./private_key.pem'),
  //       region: 'us',
  //       sandbox: true
  //   };

  //   const payload = {
  //       webCheckoutDetails: {
  //           checkoutReviewReturnUrl: 'https://google.com',
  //           checkoutResultReturnUrl: 'https://google.com'
  //       },
  //       storeId: 'amzn1.application-oa2-client.0284309fb0344a8abd0f2f903f091b04' // Enter Client ID
  //   };
  //   const headers = {
  //       'x-amz-pay-idempotency-key': 'AVLo5tI10BHgEk2jEXAMPLEKEY'
  //   };

  //   const testPayClient = new Client.WebStoreClient(config);
  //   const response = testPayClient.createCheckoutSession(payload, headers);
  //   response.then(res => {
  //     console.log('aaa', res)
  //   }).catch(e => {
  //     console.log('error', e)
  //   })


  // const test = new Client.WebStoreClient(config);
  // const response = test.createCheckoutSession(payload, headers);
  // response.then(res => {
  //   console.log('aaa', res.data)
  // }).catch(e => {
  //   console.log('error', e)
  // })



  // sendNotification(`testing`, `backend`, 
  // ['e3J7w7blkv43Mx3DQW38qJ:APA91bGvMptZrbYxSWe7hqLZtbkQ5MzLOZ7xuAkzpl0kal4Fd23vAhN7HgY5eGeoRJOXnnWoiQOrAO57iR8lqW1oxdh32o8w8rrxz0dlhOGeYuZPC1IsbrZxAgGXJ4_bti3rWVhvydA3',],
  // {url:'https://pu-crm.herokuapp.com/'})
  console.log(`listening on port ${port}`)
  this.dynoTime = new Date().getTime();

  // fetch(`http://74.208.31.179:8520/MobileApp_API/size-chart1.asp?rsBrand=13&rsGender=3&rsCategory=1&rssizechart=`, {
  //     method: 'GET',
  //     headers: {
  //       Accept: 'application/json',
  //       "Content-Type": "application/json",
  //     },
  //   }).then(response => {
  //     return response.json()
  //   }).then(response => {
  //     console.log(response)
  //     res.send(response)
  //   })
});
const { webSocketServer } = require('./socket');
webSocketServer.init(server);
