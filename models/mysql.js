/* 	Ajilal Vijayan, 
Technical Affairs Department, MOTC
*/
var mysql = require('mysql');
var fs = require("fs");
var path = require('path')

const localConfig = {
  host: 'localhost',
  user: 'test',
  password: 'password',
  database: 'nof-data'
};

const stagingConfig = {
  host: process.env.MYSQLCONNSTR_DBHOST,
  user: process.env.MYSQLCONNSTR_DBUSER,
  password: process.env.MYSQLCONNSTR_DBPASS,
  ssl  : {
    ca : fs.readFileSync(path.resolve(__dirname ,"./mysql.crt"))
  }
};

const connection = mysql.createConnection(stagingConfig);

exports.executeQuery = function RunQuery(qry, inputs, done) {
  connection.query(qry, inputs, function (error, results, fields) {
    if (error) return done(error, null);
    return done(null, results)
  });
}
