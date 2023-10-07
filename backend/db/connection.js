const mysql = require("mysql2")

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASS || '',
    database: process.env.MYSQL_DB || 'application'
});

db.connect(function (err) {
    if (err) {
        console.error(`error connecting: ${err.stack}`);
        process.exit(1)
    }
    console.log(`DB Connection Established with ID -> ${db.threadId}`);
});

module.exports = db;