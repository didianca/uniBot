const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/db.db');

const init = () => {
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS players (
            id INT,
            name STRING,
            hand_elo
            )`);
            const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
            //     stmt.run("Ipsum " + i);
            stmt.finalize();
            db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
                console.log(row.id + ": " + row.info);
            });
        });
};

const insertPlayerIfNotExists = (memberId, name, hand_elo = 5) => {
    const stmt = db.prepare(`INSERT OR IGNORE INTO players(id, name, hand_elo)
     VALUES (?, ? , ?)`);
    stmt.run(memberId, name, hand_elo);
    stmt.finalize();
};

const getPlayers = (memberIds) => {
    const stmt = db.prepare(`INSERT OR IGNORE INTO players(id, name, hand_elo)
     VALUES (?, ? , ?)`);
    stmt.run(memberId, name, hand_elo);
    stmt.finalize();
};


module.exports = {
    init,
    insertPlayerIfNotExists,
    getPlayers
};
