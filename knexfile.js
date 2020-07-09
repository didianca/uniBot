const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_PORT,
  DB_NAME
} = require('./config');

module.exports = {
  client: 'mysql',
  connection: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_NAME
  },
  migrations: {
    directory: __dirname + '/src/knex/migrations',
  },
  seeds: {
    directory: __dirname + '/src/knex/seeds',
  },
};
