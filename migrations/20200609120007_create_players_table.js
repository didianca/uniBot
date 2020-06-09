exports.up = knex =>
    knex.schema.createTableIfNotExists('players', table => {
        table
            .string('id', 32)
            .primary()
            .unique();
        table.string('name', 256).notNullable();
        table.float('last_elo', 7,4);      //  if player has no previous game, update this field
        table.float('current_elo',7,4);   //  if player has previous elo update this field
        table.timestamps(true, true);
    })

exports.down = knex => knex.schema.dropTableIfExists('players')