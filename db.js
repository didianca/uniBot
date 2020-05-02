const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/db.db');

const init = () => {
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS players (
            info TEXT
            
            )`);
            const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
            //     stmt.run("Ipsum " + i);
            stmt.finalize();
            db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
                console.log(row.id + ": " + row.info);
            });
        });
        db.close();
};

module.exports = {
    init,

};
