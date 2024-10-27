require("dotenv").config();
const mysql = require("mysql2/promise");

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   // password: '123',
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT, // default 3306
// });

// Connection Pools
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT, // default 3306
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
