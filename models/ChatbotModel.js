const url = 'https://pu-crm.herokuapp.com'
const { Promise } = require('mssql');
const fetch = require('node-fetch');

const convertTime = "CONVERT_TZ( NOW(), '+08:00', '+05:00')";
const sql = require("./db");

const User = (user) => {
    this.user = user.user,
        this.created_at = new Date()
};

const header = {
    Accept: '*/*',
    "Content-Type": "application/json",
};

const apiFetch = (apiUrl, apiMethod, apiBody) => {
    console.log('inside 1')
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
const extractOrderStatus = (sentence) => {
    return new Promise((resolve, reject) => {
        apiFetch('puchatbot/decodeOrderId', 'POST', JSON.stringify({ sentence })).then(orderId => {
            console.log('inside')
            // if order id not provided
            if (orderId === 'nothing') {
                apiFetch('puchatbot/decodeName', 'POST', JSON.stringify({ sentence })).then(res => {
                    const { name, zipcode } = res
                    let storeProcedure = `exec [Get_orderstatus_STP] null, '${name.trim()}', '${zipcode.trim()}'`
                    sql.queryRunVI(storeProcedure, 'pu_admin', (err, res) => {
                        console.log('1', res)
                        if (err) reject(err);
                        else resolve (res)
                    });
                })
            } else {
                // check order status through order id
                let storeProcedure = `exec [Get_orderstatus_STP] '${orderId}', null, null`
                sql.queryRunVI(storeProcedure, 'pu_admin', (err, res) => {
                    console.log('2', res)
                    if (err) reject(err);
                    else resolve (res)
                });
            }
        })
    })
}

User.Chat = (sentence) => {
    return new Promise(function (resolve, reject) {
        apiFetch('puchatbot/model', 'POST', JSON.stringify({ sentence })).then(response => {
            // if user wants to know order status 
            if (response.class.tag === 'order_status') {
                extractOrderStatus(sentence).then(res => { resolve(res.recordset) })
            } else {
                console.log('aaa', response.class.responses[0])
                resolve(response.class.responses[0])
            }
        })
    })
}


module.exports = User;