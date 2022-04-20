// var mysql = require('mysql');
const { sendNotification } = require("./notification");

// const url = 'http://localhost:3001'
const url = 'https://pu-crm.herokuapp.com'
const convertTime = "CONVERT_TZ( NOW(), '+08:00', '+05:00')";
const sql = require("./db");
const { sendMessage } = require("../socket");


const User = (user) => {
    this.user = user.user,
        this.created_at = new Date()
};

// Add new Ticket ssss
User.addTicket = (data) => {
    let storeProcedure = `exec stp_app_insert_CRM_TICKET null, '${data.TicketTitle}', null, '${data.TicketGroup}', '${data.Subject}', "${data.Description}",
                        ${data.CustomerName === '' ? null : JSON.stringify(data.CustomerName)}, null, ${data.CustomerContact === '' ? null : JSON.stringify(data.CustomerContact)}, '${data.Status}', '', '', '${data.LoginName}', 
                        ${data.OrderNo === '' ? null : JSON.stringify(data.OrderNo)}, ${data.ZipCode === '' ? null : JSON.stringify(data.ZipCode)}, null, 
                        null, '${data.Assigned}', '', '', '', '', '', ${data.Attachment !== null ? JSON.stringify(data.Attachment) : null}, 
                        ${data.FromTicketGroup !== 'null' ? JSON.stringify(data.FromTicketGroup) : null}`
    console.log('query', storeProcedure)
    return new Promise(function (resolve, reject) {
        sql.queryRun(storeProcedure, (err, res) => {
            if (err) {
                return reject(err);
            } else {
                res.recordset[0].Token && sendNotification(`New Ticket`, `New Ticket Assigned To You`, res.recordset[0].Token.split('-crm-'), {url:`${url}/admin/ticket/ticketDetails/${res.recordset[0].TicketNo}`})
                return resolve(res.recordset[0]);
            }
        });
    })
}

// Get all tickets
User.getTickets = (data) => {
    let storeProcedure = `exec CRM_TICKET_view '${data.LoginName}'`
    console.log('aaa', storeProcedure)
    return new Promise(function (resolve, reject) {
        sql.queryRun(storeProcedure, (err, res) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(res.recordset);
            }
        });
    })
}

// Add new Comment to existing ticket
User.addComment = (data) => {
    let storeProcedure = `exec stp_app_insert_CRM_TICKET '${data.TicketNo}', '${data.TicketTitle}', null, '${data.TicketGroup}', '${data.Subject}', "${data.Description}", 
                        '${data.CustomerName}', null, '${data.CustomerContact}', '${data.Status}', '', '', '${data.CreateBy}', '${data.OrderNo}', '${data.ZipCode}', null, 
                        null, '${data.Assigned}', '', '', '', '', '', ${data.Attachment !== undefined ? JSON.stringify(data.Attachment) : null},  ${data.FromTicketGroup!=='null' ? JSON.stringify(data.FromTicketGroup): null}`
                        return new Promise(function (resolve, reject) {
        sql.queryRun(storeProcedure, (err, res) => {
            if (err) {
                return reject(err);
            } else {
                res.recordset[0].Token && sendNotification(`New Comment`, `New Comment Assigned To You`, res.recordset[0].Token.split('-crm-'), {url: `${url}/admin/ticket/ticketDetails/${data.TicketNo}`})
                return resolve(res.recordset[0]);
            }
        });
    })
}


// Add new Comment to existing ticket
User.addReminder = (data) => {
    let storeProcedure = `exec STP_APP_APPREMINDER_INSERT '${data.CreateBy}', ${data.TicketNo!=='null' ? JSON.stringify(data.TicketNo): null}, '${data.StartTime}',
                        '${data.EndTime}', '${data.Assigned}', '${data.CreateBy}',
                        "${data.Message}", '${data.ReminderType}', '${data.TicketGroup}', '${data.FromTicketGroup}'`
    return new Promise(function (resolve, reject) {
        console.log('aaaa',storeProcedure )
        sql.queryRun(storeProcedure, (err, res) => {
            if (err) {
                return reject(err);
            } else {
                res.recordset[0].Token && sendNotification(`New Reminder`, `New Reminder Assigned To You`,
                    res.recordset[0].Token.split('-crm-'), { url: `${url}/admin/ticket/viewReminders`,ReminderID: res.recordset[0].reminderID},
                    [{ title: '👍Like' },
                    { title: '⤻ Reply' }])
                return resolve(res.recordset[0]);
            }
        });
    })
}

// Get all comments of existing ticket
User.getComments = (data) => {
    let result = { comments: [], reminders: [] }
    let storeProcedure = `exec CRM_TICKET_where_ticket '${data.TicketNo}'`
    return new Promise(function (resolve, reject) {
        sql.queryRun(storeProcedure, (err, res) => {
            if (err) {
                return reject(err);
            } else {
                result.comments = res.recordset
                storeProcedure = `exec stp_app_ticket_remainders_view '${data.TicketNo}'`
                sql.queryRun(storeProcedure, (err, res) => {
                    if (err)
                        return reject(err)
                    else {

                        result.reminders = res.recordset
                        return resolve(result)
                    }
                })
            }
        });
    })

}

// when ticket status change
User.onStatusChange = (data) => {
    let storeProcedure = `exec stp_app_insert_CRM_TICKET '${data.TicketNo}', '${data.TicketTitle}', null, '${data.TicketGroup}', null, null, 
                        '${data.CustomerName}', null, '${data.CustomerContact}', '${data.Status}', '', '', '${data.CreateBy}', '${data.OrderNo}', '${data.ZipCode}', null, 
                        null, '${data.Assigned}', '', '', '', '', '', '', '${data.FromTicketGroup}'`
    return new Promise(function (resolve, reject) {
        sql.queryRun(storeProcedure, (err, res) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(res)
            }
        });
    })
}

// reminders for specific user
User.getUserReminders = (data) => {
    let storeProcedure = `exec stp_app_ticket_remainders_view_user '${data.LoginName}'`
    return new Promise(function (resolve, reject) {
        sql.queryRun(storeProcedure, (err, res) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(res.recordset)
            }
        });
    })
}

// reminders for specific user
User.getDeparts = () => {
    let storeProcedure = `Select FirstName as Username, LOWER(Username) as LoginName,GroupName from PU_CRM.dbo.groupname g
    inner join users u on u.LoginName=g.Username`
    return new Promise(function (resolve, reject) {
        sql.queryRun(storeProcedure, (err, res) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(res.recordset)
            }
        });
    })
}

// get Details of specific ticket
User.getTicketDetail = (data) => {
    let storeProcedure = `exec STP_APP_CRM_TICKET_Details '${data.TicketNo}'`
    return new Promise(function (resolve, reject) {
        sql.queryRun(storeProcedure, (err, res) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(res.recordset[0])
            }
        });
    })
}

// get Details of specific ticket
User.reminderStatusChange = (data) => {
    let storeProcedure = `exec stp_app_ticket_remainders_Status_update '${data.ReminderID}', '${data.Status}'`
    return new Promise(function (resolve, reject) {
        sql.queryRun(storeProcedure, (err, res) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(res)
            }
        });
    })
}

// get Details of specific ticket
User.getCustomerDetail = (data) => {
    let storeProcedure = `exec STP_CRM_TICKET_GET_ORDERDETAILS_BY_${data.name==='orderno'? 'ORDERNO':'ZIPCODE' } '${data.value}'`
    return new Promise(function (resolve, reject) {
        sql.queryRun(storeProcedure, (err, res) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(res.recordset)
            }
        });
    })
}

User.TicketStatusChange = (data) => {
    let storeProcedure = `exec [CRM_TICKET_view_status] '${data.LoginName}', '${data.StatusSort}'`
    return new Promise(function (resolve, reject) {
        sql.queryRun(storeProcedure, (err, res) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(res.recordset)
            }
        });
    })
}

User.insertDeviceToken = (data) => {
    let storeProcedure = `exec [insert_Device_Token_STP] '${data.loginName}', '${data.deviceToken}', '${data.jwtToken}'`
    return new Promise(function (resolve, reject) {
        sql.queryRun(storeProcedure, (err, res) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(res.recordset)
            }
        });
    })
}

User.userRemindersOnStatus = (data) => {
    let storeProcedure = `exec [stp_app_remainders_list_status_sort] '${data.LoginName}', '${data.status}'`
    console.log('asdasds', storeProcedure)
    return new Promise(function (resolve, reject) {
        sql.queryRun(storeProcedure, (err, res) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(res.recordset)
            }
        });
    })
}


module.exports = User;


// { OrderNo: 'AM-170717-089',
//     FullName: 'JESSICA',
//     CustomerLogin: 'amazon@pulseuniform.com',
//     OrderStatus: 'Shipped',
//     OrderAmount: 26.98,
//     ZipCode: '94513-6123',
//     PhoneNumber: '4157282907' }