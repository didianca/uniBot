const mysql = require('mysql');
const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_PORT
} = require('./config');

const environment = process.env.ENVIRONMENT || 'development'
const config = require('../knexfile.js')[environment];
