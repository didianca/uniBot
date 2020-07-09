const { getPlayerByInGameName, getAverageScoreFromMatches, addMatch } = require('../knex/db');
const uuid = require('uuid');

const getScoreAverageChangeMsg = (oldScores, newScores) => {
    const scoreDifference = {};
    Object.keys(oldScores).forEach(user => {
        scoreDifference[user] = Math.round(oldScores[user].score - newScores[user].score); // ???
    });
    return scoreDifference;
};

const getEveryonesAverageScore = async (inGameNames) => {
    const oldScores = {};
    await Promise.all(Object.keys(inGameNames).map(async key => {
        const player = await getPlayerByInGameName(key);
        if (!player) {
            console.log(`IGN not set for : ${key}`)
        } else {
            oldScores[key] = await getAverageScoreFromMatches(player.id);
        }
    }));
    console.log(oldScores)
    return oldScores;
};

const recordCombatScores = async (inGameNames) => {
    const matchId = uuid.v4();
    const newAverages = {};
    await Promise.all(Object.keys(inGameNames).map(async name => {
        const player = await getPlayerByInGameName(name)
        if (!player) {
            //console.log(`IGN not set for : ${name}`)
        } else {
            await addMatch(matchId, player.id, inGameNames[name]);
            //console.log('Added ');
             const avg = await getAverageScoreFromMatches(player.id);
             newAverages[name] = avg.score
        }
    }));
    return newAverages;
};


module.exports = {
    getScoreAverageChangeMsg,
    getEveryonesAverageScore,
    recordCombatScores
}