// db.js
const { Pool } = require("pg");
require("dotenv").config();
pw = process.env.password
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "text-summary",
  password: pw,
  port: 5432,
});

module.exports = pool;
