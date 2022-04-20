const fetch = require('node-fetch');
const { Promise } = require('mssql');
const sql = require("./models/db");

const header = {
    Accept: '*/*',
    "Content-Type": "application/json",
};

const apiFetch = (apiUrl, apiMethod, apiBody) => {
    return new Promise((resolve, reject) => {
        fetch(`https://chatbot-pu.herokuapp.com/${apiUrl}`, {
            method: apiMethod,
            headers: header,
            body: apiBody
        }).then(res => {
                return res.json()
            })
            .then(resJson => {
                if (resJson) {
                    resolve(resJson);
                }
            })
            .catch(err => { console.log(err) })
    });
};


// method to extract order status
exports.extractOrderStatus = (sentence) => {
    return new Promise((resolve, reject) => {
        apiFetch('puchatbot/decodeOrderId', 'POST', JSON.stringify({ sentence })).then(orderId => {
            // if order id not provided
            if (orderId === 'nothing') {
                apiFetch('puchatbot/decodeName', 'POST', JSON.stringify({ sentence })).then(res => {
                    const { name, zipcode } = res
                    let storeProcedure = `exec [Get_orderstatus_STP] null, '${name.trim()}', '${zipcode.trim()}'`
                    sql.queryRunVI(storeProcedure, 'pu_admin', (err, res) => {
                        if (err) reject(err);
                        else resolve (res)
                    });
                })
            } 
            else {
                // check order status through order id
                let storeProcedure = `exec [Get_orderstatus_STP] '${orderId}', null, null`
                sql.queryRunVI(storeProcedure, 'pu_admin', (err, res) => {
                    console.log('1111', res)
                    if (err) reject(err);
                    else resolve (res)
                });
            }
        })
    })
}

exports.sendMessageToClient = (clients, message, isSelf, ws) => {
    let result = { reason: message.reason ? message.reason: 'chatbotReply', data: {} }
    clients.forEach(client => {
        //if (isSelf ? client === ws : client !== ws) {
            client.send(JSON.stringify({ ...result, data: message }))
        //}
      });
}

module.exports.apiFetch = apiFetch;
