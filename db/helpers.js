const { Client } = require('pg');

const client = new Client({
  user: 'ubuntu',
  host: '3.142.222.36',
  database: 'postgres',
  password: 'ubuntu',
  port: 5432,
});

client.connect((err) => {
  if (err) {
    console.log('error connecting to db', err);
  }
  console.log('connected to sdc :P');
});

module.exports = client;
