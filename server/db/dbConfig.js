const { Pool } = require('pg');

const itemsPool = new Pool({
  connectionString: process.env.DB_CONN_LINK,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = itemsPool;
