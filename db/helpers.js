const { Pool } = require('pg');

const pool = new Pool({
  user: 'ubuntu',
  host: '172.31.36.175',
  database: 'sdc',
  password: 'ubuntu',
  port: 5432,
});

pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.log('error connecting to db', err);
  }
  console.log('connected to sdc :P');
});

module.exports = pool;
