exports.up = knex =>
    knex.schema.createTableIfNotExists('matches', table => {
        table
            .string('id', 32)
            .primary();
        table
            .string('player_id', 32)
            .references('id').inTable('players');
        table
            .unique(['id','player_id']);
        table.integer('score');
        table.timestamps(true, true);
    })

exports.down = knex => knex.schema.dropTableIfExists('matches')