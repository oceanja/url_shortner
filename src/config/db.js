const { Pool } = require("pg");

const pool = new Pool({
  user: "Ocean",          // or whatever `whoami` returned
  host: "localhost",
  database: "url_shortener_db",
  password: "",           // leave empty
  port: 5432,
});

module.exports = pool;
