const Knex = require('knex');
const knexConfig = require('../../knexfile');

const { Model } = require('objection');
const { Match } = require('./models/Match');

// Initialize knex.
const knex = Knex(knexConfig);

Model.knex(knex);

const getAverageScoreFromMatches = async (id) =>
    await Match.query().avg('score').where({id});

const addMatch = async (matchId, playerId, score) =>
    await Match.query().insert({id: matchId, player_id: playerId, score})

module.exports = {
    getAverageScoreFromMatches,
    addMatch,
}

