const mysql = require('mysql');
const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_PORT
} = require('./config');

module.exports.db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
});

module.exports.insertPlayerIfNotExists = (discordUserId, playerName) => {
    db.query(
        `INSERT INTO (id, name) VALUES (${discordUserId}, ${playerName})`, (err) => {
            let outcome = `${playerName}, you are now part of the squad!`;
            if(err) {
                console.log(err);
                outcome = 'Something went wrong';
            }
            return outcome;
        }
    )
}