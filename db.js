const Knex = require('knex');
const knexConfig = require('./knexfile');

const { Model } = require('objection');
const { Player } = require('./models/Player');

// Initialize knex.
const knex = Knex(knexConfig);

Model.knex(knex);

const insertPlayerIfNotExists = async (playerId, name) => {
    await Player.query().insert({
        id: playerId,
        name
    })
}


const getPlayerById = async (playerId) => {
    await Player.query().where({
        id: playerId
    })
}


const updatePlayerInGameName = async (playerId, name) =>
    await Player.query().update({ name }).where({id: playerId})

module.exports = {
    insertPlayerIfNotExists,
    getPlayerById,
    updatePlayerInGameName,
}

