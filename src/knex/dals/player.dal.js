const { Player } = require('../models/Player');

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

const getPlayerByName = async (name) =>
    await Player.query().findOne({ name: name});

const getPlayerByInGameName = async (inGameName) =>
    await Player.query().findOne({ in_game_name: inGameName});


const getAllPlayers = async  () =>
    await Player.query();

const updatePlayerName = async (id, name) =>
    await Player.query().update({name}).where({id});

const updatePlayerInGameName = async (playerId, inGameName) =>
    await Player.query().update({ in_game_name: inGameName }).where({id: playerId});

const getPlayersInVoiceChannel = async (ids) =>
    await Player.query().whereIn('id',ids)

module.exports = {
    insertPlayer,
    getPlayerNameById,
    getPlayerById,
    getPlayerByName,
    getPlayerByInGameName,
    getAllPlayers,
    updatePlayerName,
    updatePlayerInGameName,
    getPlayersInVoiceChannel
}