const sqlite = require('sqlite-async');
let db;
const init = async () => {
    try {
        db = await sqlite.open('./data/db.db');
        await db.run(`CREATE TABLE IF NOT EXISTS players (
            id INT,
            name STRING,
            hand_elo
            )`);
        const stmt = await db.prepare("INSERT INTO lorem VALUES (?)");
        //     stmt.run("Ipsum " + i);
        await stmt.finalize();
        console.log('DB started');
    } catch (error) {
        throw Error('can not access sqlite database');
    }
};

const insertPlayerIfNotExists = async (memberId, name, hand_elo = 5) => {
    const stmt = await db.prepare(`INSERT OR IGNORE INTO players(id, name, hand_elo)
     VALUES (?, ? , ?)`);
    stmt.run(memberId, name, hand_elo);
    stmt.finalize();
};

const getPlayers = async memberIds => {
    const users = [];
    await Promise.all(memberIds.map(async id => {
        users.push(await db.get(`SELECT * FROM players WHERE id = ?`, id));
    }));
    console.log('users', users)
};

module.exports = {
    init,
    insertPlayerIfNotExists,
    getPlayers
};
