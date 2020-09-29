const mysql = require('mysql2');
const config = require('../../config');

const mysqlConnection = mysql.createPool({
    host    : config.db.host,
    user    : config.db.user,
    database: config.db.database,
    password: config.db.password,
});

module.exports = mysqlConnection;
