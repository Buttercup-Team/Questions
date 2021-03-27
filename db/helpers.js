const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: 'sdc',
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.log('error connecting to db', err);
  }
  console.log('connected to sdc :P');
});

module.exports = pool;
