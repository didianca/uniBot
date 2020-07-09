const { Model } = require('objection');

class Player extends Model{
    static tableName = 'players';
    static id = 'id';
}

module.exports = {
    Player
}