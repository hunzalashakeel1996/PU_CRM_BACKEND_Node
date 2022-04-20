// var mysql = require('mysql');
const convertTime = "CONVERT_TZ( NOW(), '+08:00', '+05:00')";
const sql = require("./db");
const jwt = require('jsonwebtoken');
const { jwtKey, passwordEncKey } = require('../config');

const User = (user) => {
    this.user = user.user,
        this.created_at = new Date()
};

// authenticate user with username and password
User.login = (data) => {
    let jwt_key = jwt.sign({ username: data.username, token: data.Token, passwordEncKey}, jwtKey)
storeProcedure = `exec [STP_APP_USER_VerifyUser] '${datadata.username}','${data.password}','${passwordEncKey}', '${data.Token}', '${jwt_key}'`
    // storeProcedure = `exec [STP_APP_USER_VerifyUser] '${data.email}', '${data.Token}'`
    console.log(storeProcedure)
    return new Promise(function (resolve, reject) {
        sql.queryRun(storeProcedure, (err, res) => {
            if (err) {
                // console.log(err);
                return reject(err);
            } else {
                console.log('response', res);
                let result = res.recordset.length <= 0 ? {err:'Incorrect Username or Password'} : {...res.recordset[0], jwtToken: jwt_key}
                return resolve(result);
            }
        });
    })
}

// logout
User.logout = (data) => {
    storeProcedure = `exec [STP_logout] '${data.LoginName}','${data.token}'`
    console.log(storeProcedure)
    return new Promise(function (resolve, reject) {
        sql.queryRun(storeProcedure, (err, res) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(res);
            }
        });
    })
}

module.exports = User;



// passwordEncKey, jwtcrmpuprivatekey
// auth api jwtKey