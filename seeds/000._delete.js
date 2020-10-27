exports.seed = function(knex) {
    return knex('posts').del()
    .then(() => {
        return knex('threads').del()
        .then(() => {
            return knex('boards').del()
            .then(() => {
                return knex('users').del()
                .then(() => {
                    return knex('roles').del();
                });
            });
        });
    });
};
