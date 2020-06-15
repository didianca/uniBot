const Knex = require('knex');
const knexConfig = require('./knexfile');

const { Model } = require('objection');
const { Player } = require('./models/Player');
const { Match } = require('./models/Match');

// Initialize knex.
const knex = Knex(knexConfig);

Model.knex(knex);

const insertPlayer = async (playerId, name) =>
    await Player.query().insert({
        id: playerId,
        name
    });



const getPlayerNameById = async (playerId) =>
    await Player.query().where({
        id: playerId
    });

const getPlayerById = async (playerId) =>
    await Player.query().findOne({ id: playerId});

const getAllPlayers = async  () =>
    await Player.query();

const updatePlayerName = async (id, name) =>
    await Player.query().update({name}).where({id});

const updatePlayerInGameName = async (playerId, inGameName) =>
    await Player.query().update({ in_game_name: inGameName }).where({id: playerId});

const getAverageScoreFromMatches = async (id) =>
    await Match.query().avg('score').where({id});

const getPlayersInVoiceChannel = async (ids) =>
    await Player.query().whereIn('id',ids)

module.exports = {
    insertPlayer,
    getPlayerById,
    updatePlayerInGameName,
    getAllPlayers,
    updatePlayerName,
    getAverageScoreFromMatches,
    getPlayersInVoiceChannel,
}

