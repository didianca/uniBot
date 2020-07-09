exports.up = knex =>
    knex.schema.alterTable('players', table => {
        table.string('in_game_name', 256).defaultTo(null);
    })

exports.down = knex => knex.schema.alterTable('players', table => {
    table.dropColumn('in_game_name');
})