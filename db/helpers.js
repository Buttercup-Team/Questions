const { Pool } = require('pg');
const dbp = require('./dbp.js');

const secret = dbp.TOKEN;

const pool = new Pool({
  user: 'ubuntu',
  host: '3.142.220.111',
  database: 'sdc',
  password: secret,
  port: 5432,
});

pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.log('error connecting to db', err);
  }
  console.log('connected to sdc :P');
});

module.exports = pool;
