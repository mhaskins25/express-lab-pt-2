const { Pool } = require("pg");
const credentials = new Pool({
  user: "postgres",
  password: "BoWhiskey44",
  host: "localhost",
  port: 5432,
  database: "ExpressShopDB",
  ssl: false
});

module.exports = credentials;