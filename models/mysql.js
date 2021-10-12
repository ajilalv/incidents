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
  database: 'avschema',
  ssl  : {
    ca : fs.readFileSync(path.resolve(__dirname ,"./mysql.crt"))
  }
};

const conctnPool = mysql.createPool(stagingConfig);

exports.executeQuery = function RunQuery(qry, inputs, done) {
  conctnPool.query(qry, inputs, function (error, results, fields) {
    if (error) return done(error, null);
    return done(null, results)
  });
}
