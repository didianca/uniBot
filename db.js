const mysql = require('mysql');
const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_PORT
} = require('./config');

module.exports.connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
});

// connection.end(err => {
//     if(err){
//         console.log(`Encountered error while ending connection: ${err.stack}`)
//         return;
//     }
//     console.log('Successfully terminated connection.')
// });