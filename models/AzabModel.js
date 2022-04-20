const url = 'https://pu-crm.herokuapp.com'

const convertTime = "CONVERT_TZ( NOW(), '+08:00', '+05:00')";
const sql = require("./db");

const User = (user) => {
    this.user = user.user,
        this.created_at = new Date()
};



User.AzabReport = (data) => {
    console.log('Action ',data)
    let storeProcedure = `exec [STP_REPORT_AAZAB_ORDERS] '${data.month}'`

    return new Promise(function (resolve, reject) {
        sql.queryRun(storeProcedure, (err, res) => {
            if (err) {
                return reject(err);
            } else {
                console.log(storeProcedure)
                return resolve(res.recordset)
            }
        });
    })
}


User.insertRecord = (data) => {
        let storeProcedure = `exec Remaining_label_Stp`
        console.log(`Hello World`);
         console.log(url);
       return new Promise(function (resolve, reject) {
       sql.queryRunVI(storeProcedure,"PU_Admin", (err, res) => {
             if (err) {
             return reject(err);
            } else {
            return resolve(res.recordset);
            }
    });
    })
    }

module.exports = User;