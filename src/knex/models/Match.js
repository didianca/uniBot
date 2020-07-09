const { Model } = require('objection');

class Match extends Model{
    static tableName =' matches';
    static idColumn = ['id', 'player_id']
}

module.exports = {
    Match
}