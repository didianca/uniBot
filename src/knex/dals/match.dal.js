const { Match } = require('../models/Match');

const getAverageScoreFromMatches = async (id) =>
    await Match.query().avg('score').where({id});

const addNewMatch = async (matchId, playerId, score) =>
    await Match.query().insert({id: matchId, player_id: playerId, score})

module.exports = {
    getAverageScoreFromMatches,
    addNewMatch,
}
