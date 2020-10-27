
exports.up = function(knex) {
    return knex.schema
        .createTable('roles', table => {
            table.increments('id').notNullable();
            table.string('role').unique().notNullable();
        })
        .createTable('users', table => {
            table.increments('id').notNullable();

            table.integer('role_id').unsigned().notNullable();
            table.foreign('role_id').references('roles.id');

            table.string('username').unique().notNullable();
            table.string('password_hash').notNullable();
            table.string('email').unique().notNullable();

            table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
            table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        })
        .createTable('keys', table => {
            table.increments('id').notNullable();
            
            table.integer('user_id').unsigned().notNullable();
            table.foreign('user_id').references('users.id');

            table.string('key', 128).unique().notNullable();
            table.boolean('used').notNullable();

            table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP')); //this will be set when used is set = true
            table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        })
        .createTable('boards', table => {
            table.increments('id').notNullable();
            table.string('title').unique().notNullable();
            table.string('url').unique().notNullable();
        })
        .createTable('threads', table => {
            table.increments('id').notNullable();

            table.integer('board_id').unsigned().notNullable();
            table.foreign('board_id').references('boards.id');

            table.integer('user_id').unsigned().notNullable();
            table.foreign('user_id').references('users.id');

            table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        })
        .createTable('posts', table => {
            table.increments('id').notNullable();
            table.string('content', 2048).notNullable(); //2048 chars limit from 255 default
            table.string('image').unique(); // string is path to image file. Note: This IS nullable

            table.integer('thread_id').unsigned().notNullable();
            table.foreign('thread_id').references('threads.id');

            table.integer('user_id').unsigned().notNullable();
            table.foreign('user_id').references('users.id');

            //table.timestamp('updated_at').defaultTo(knex.raw('NULL ON UPDATE CURRENT_TIMESTAMP'));
            table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        })
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('posts')
        .dropTableIfExists('threads')
        .dropTableIfExists('boards')
        .dropTableIfExists('keys')
        .dropTableIfExists('users')
        .dropTableIfExists('roles');
};
