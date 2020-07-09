exports.up = knex =>
    knex.schema.alterTable('players', table => {
        table.dropColumn('last_elo');
        table.dropColumn('current_elo');
        table.float('elo',7,4).after('name');
    })

exports.down = knex => knex.schema.alterTable('players', table => {
    table.float('last_elo', 7, 4);
    table.float('current_elo', 7, 4);
    table.dropColumn('elo');
})