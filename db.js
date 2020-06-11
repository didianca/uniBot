const mysql = require('mysql');
const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_PORT,
    DB_NAME
} = require('./config');

const db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_NAME
});

const insertPlayerIfNotExists = (playerId, name) => {
    db.query(
        `INSERT INTO players (id, name) VALUES ('${playerId}', '${name}')`, (err, result, fields) => {
            if (err) console.log(err)
            if (result) {
                return result.length;
            } else {
                return false;
            }
        }
    )
}


const getPlayerById = (playerId) => {
    db.query(
        `SELECT * FROM players WHERE id = '${playerId}'`, (err, result, fields) => {
            if (err) console.log(err)
            if(result){
                return result.length;
            } else {
                return false;
            }
        }
    )
}


const updatePlayerInGameName = (playerId, name) => {
    db.query(
        `UPDATE players SET name = '${name}' WHERE id = '${playerId}'`, (err, result, fields) => {
            if (err) console.log(err)
            if (result) {
                return result.length;
            } else {
                return false;
            }
        }
    )

}
module.exports = {
    db,
    insertPlayerIfNotExists,
    getPlayerById,
    updatePlayerInGameName,
}

