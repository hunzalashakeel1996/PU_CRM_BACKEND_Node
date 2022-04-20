// var mssql = require('mssql');
var mysql = require('mysql');
let mssql = require('mssql')

const { db_server, db_user, db_password, db_database, db_timezone,db_server_VI, db_user_VI, db_password_VI, db_database_VI, db_timezone_VI, db_database_puAdmin } = require('../config');

const dbModel = data => {
  this.data = data;
};

const db = {
  server    : db_server,
  user      : db_user, 
  password  : db_password,
  database: db_database,
  timezone: db_timezone,
  port: 2421,
};
const dbVI = {
  server: db_server_VI,
  user: db_user_VI,
  password: db_password_VI,
  // database  : db_database_VI, 
  timezone: 'GMT+00:00',
  requestTimeout: 60000,
  connectionTimeout: 60000,
  port: 2421,
};

dbModel.queryRun = async(query, callback) => {
    //local mssql db connection
    //   const connection = mssql.createConnection(db);
    let pool = new mssql.ConnectionPool(db);
    try {
      await pool.connect();
      let result = await pool.request().query(query);
      return callback(null, result)
    } catch (err) { 
      return callback(err, null)
    } finally {
      pool.close(); //closing connection after request is finished.
    }
}

dbModel.queryRunVI = async (query, database, callback) => {
  //local mssql db connection
  //   const connection = mssql.createConnection(db);
  let pool = new mssql.ConnectionPool({...dbVI, database});
  try {
    await pool.connect();
    let result = await pool.request().query(query);
    return callback(null, result)
  } catch (err) { 
    return callback(err, null)
  } finally {
    pool.close(); //closing connection after request is finished.
  }
}

module.exports = dbModel;