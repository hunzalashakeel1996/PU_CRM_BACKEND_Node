const url = 'https://pu-crm.herokuapp.com'

const convertTime = "CONVERT_TZ( NOW(), '+08:00', '+05:00')";
const sql = require("./db");

const User = (user) => {
    this.user = user.user,
        this.created_at = new Date()
};



// User.AzabReport = (data) => {
//     console.log('Action ',data)
//     let storeProcedure = `exec [STP_REPORT_AAZAB_ORDERS] '${data.month}'`

//     return new Promise(function (resolve, reject) {
//         sql.queryRun(storeProcedure, (err, res) => {
//             if (err) {
//                 return reject(err);
//             } else {
//                 console.log(storeProcedure)
//                 return resolve(res.recordset)
//             }
//         });
//     })
// }


User.getVendorname = (data) => {
        let storeProcedure = `exec stp_get_VendorName`
        console.log(`Hello World`);
         console.log(url);
       return new Promise(function (resolve, reject) {
       sql.queryRunVI(storeProcedure,"Vendor_Inventory", (err, res) => {
             if (err) {
             return reject(err);
            } else {
                // console.log(res.recordset[0])
            return resolve(res.recordset[0]);
            }
    });
    })
    }

module.exports = User;