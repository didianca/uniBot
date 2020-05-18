const sqlite = require('sqlite-async');
const uuid = require('uuid');
let db;
const init = async () => {
    try {
        db = await sqlite.open('./data/db.db');
        await db.run(`CREATE TABLE IF NOT EXISTS players (
            id text ,
            name text ,
            ign text  NULL,
            hand_elo INT,
            UNIQUE(id),
            PRIMARY KEY (id));`).catch(e => console.log(e));
        await db.run(`CREATE TABLE IF NOT EXISTS matches (
            id text ,
            player_id text ,
            combat_score INT,
            win BOOLEAN,
            FOREIGN KEY (player_id) REFERENCES players(id),
            UNIQUE (id, player_id));`).catch(e => console.log(e));
        await db.run(` CREATE TABLE IF NOT EXISTS in_progress_match (
            id TEXT,
            player_id text ,
            team BOOLEAN,
            FOREIGN KEY (player_id) REFERENCES players(id),
            UNIQUE (id, player_id));`).catch(e => console.log(e));
        console.log('Unicorn trotting...');
    } catch (error) {
        throw Error('can not access sqlite database');
    }
};

const insertPlayerIfNotExists = async (memberId, name, hand_elo = 50) => {
    const stmt = await db.prepare(`INSERT OR IGNORE INTO players(id, name, hand_elo)
     VALUES (?, ?, ?)`);
    await stmt.run(memberId, name, hand_elo);
    return stmt.finalize();
};

const addMatch = async (id, playerId, combatScore, win = 0) => {
    const stmt = await db.prepare(`INSERT INTO matches(id, player_id, combat_score, win) VALUES (?,?,?,?)`);
    await stmt.run(id, playerId, combatScore, win);
    // await stmt.run(stmt);
    return stmt.finalize();
};

const recordCombatScores = async (IGNs) => {
    const matchId = uuid.v4();
    const newAverages = {};
    await Promise.all(Object.keys(IGNs).map(async key => {
        const player = await db.get(`SELECT id FROM players WHERE ign = ?`, key.toString());
         console.log('Selected', key, player);
        if (!player) {
            console.log(key, 'players IGN missing');
        } else {
            console.log('PLAYER ', player);
            await addMatch(matchId, player.id, IGNs[key]);
            console.log('Added ');
            newAverages[key] = await getAverageScore(player.id);
        }
    }));
    return newAverages;
};

const getAverageScore = async (playerId) => {
    return db.get(`SELECT avg(combat_score) averageScore FROM matches where player_id = ?;`, playerId);
};

const getLeaderboard = async () => {
    return db.all(`SELECT p.name, avg(combat_score) averageScore from matches
    JOIN players p on matches.player_id = p.id
    GROUP BY p.name ORDER BY averageScore desc LIMIT 6`);
};

const getEveryonesAverageScore = async (IGNs) => {
    const oldScores = {};
    await Promise.all(Object.keys(IGNs).map(async key => {
        const stmt = await db.prepare(`SELECT id FROM players WHERE ign = ?`);
        const player = await stmt.run(key.toString());
        if (!player) {
            console.log(key, 'players IGN missing');
        } else {
            oldScores[key] = await getAverageScore(player.id);
        }
    }));
    return oldScores;
};

const getPlayers = async memberIds => {
    const users = [];
    await Promise.all(memberIds.map(async id => {
        users.push(await db.get(`SELECT * FROM players WHERE id = ?`, id));
    }));
    return users;
};

const addInProgressMatch = async (teams) => {
    //console.log('im here im here', teams);
    const matchId = uuid.v4();
    let teamNum = -1;
    const values = teams.map(
        team => { //todo break this out into team[0] and team[1]
            teamNum++;
            return team.map(player => {
                //console.log('player\n\n\n\n', player);
                return `('${matchId}', ${player.id}, ${teamNum})`;
            }).join(',');
        }
    );
    //console.log('ID ID ID ', values);
    const stmt = await db.prepare(`INSERT INTO in_progress_match(id, player_id, team) VALUES ${values}`); // escape this > ?
    await stmt.run(stmt);
    await stmt.finalize();
    return matchId;
};

const getInProgressMatch = async () => db.all(`SELECT * FROM in_progress_match`);

const deleteInProgressMatch = async () => { // this table is essentially a cache it only holds 1 match at a time
    const stmt = await db.prepare(`DELETE FROM in_progress_match`);
    await stmt.run(stmt);
    return stmt.finalize();
};

module.exports = {
    init,
    insertPlayerIfNotExists,
    getPlayers,
    addMatch,
    addInProgressMatch,
    getInProgressMatch,
    deleteInProgressMatch,
    recordCombatScores,
    getAverageScore,
    getEveryonesAverageScore,
    getLeaderboard,
};


// INSERT INTO players (id, name, ign, hand_elo) VALUES ('134435386498744322', 'Ted', 'Teds', 55);
// INSERT INTO players (id, name, ign, hand_elo) VALUES ('172556289778515968', 'Jake', 'nizl', 88);
// INSERT INTO players (id, name, ign, hand_elo) VALUES ('178348726786588672', 'Kyle', 'Encounter', 85);
// INSERT INTO players (id, name, ign, hand_elo) VALUES ('273895099354841088', '♘Didi♘', 'didimmk', 30);
// INSERT INTO players (id, name, ign, hand_elo) VALUES ('255864014813396994', 'jon', 'i dont read good', 88);
// INSERT INTO players (id, name, ign, hand_elo) VALUES ('254483521123385345', 'matttttttt', 'washed idiot', 73);
// INSERT INTO players (id, name, ign, hand_elo) VALUES ('140909859511074816', 'Blaize', 'a fuggen croc m8', 60);
// INSERT INTO players (id, name, ign, hand_elo) VALUES ('247394479844098048', 'Long Dong Silver', 'friendofcamel', 25);
// INSERT INTO players (id, name, ign, hand_elo) VALUES ('142454868806729728', 'Sbeeblez', 'NULL', 70);
// INSERT INTO players (id, name, ign, hand_elo) VALUES ('237069160981594114', 'evan', 'Mortus73', 62);
// INSERT INTO players (id, name, ign, hand_elo) VALUES ('198108740111564800', 'Shlabbbber', 'Shlabbber', 45);
// INSERT INTO players (id, name, ign, hand_elo) VALUES ('261958692142972928', 'Justin (ohjpay)', 'ohjpay', 40);
// INSERT INTO players (id, name, ign, hand_elo) VALUES ('159518625714274306', 'Barron', 'NULL', 50);
// INSERT INTO players (id, name, ign, hand_elo) VALUES ('348507198046863362', 'gewb', 'gewbrr', 50);
// INSERT INTO players (id, name, ign, hand_elo) VALUES ('200835220063256576', 'Gatormelon', 'NULL', 70);
// INSERT INTO players (id, name, ign, hand_elo) VALUES ('537132132968169492', 'Skadooshcanoogan', 'Skadooshcanoogan', 30);
// INSERT INTO players (id, name, ign, hand_elo) VALUES ('271077219013623809', 'Chromeaurus', 'NULL', 70);
// INSERT INTO players (id, name, ign, hand_elo) VALUES ('270388293063933952', 'TheFruitBowl', 'NULL', 35);
