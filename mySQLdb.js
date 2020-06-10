const mysql = require('mysql')
const {
    HOST,
    USER,
    PASSWORD,
    PORT
} = require('./config');

const connection = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    port: PORT,
});

connection.connect(err => {
    if (err) {
        console.log(`Database connection failed: ${err.stack}`)
        return;
    }
    console.log('Successfully connected to the DB.')

})

// connection.end(err => {
//     if(err){
//         console.log(`Encountered error while ending connection: ${err.stack}`)
//         return;
//     }
//     console.log('Successfully terminated connection.')
// });