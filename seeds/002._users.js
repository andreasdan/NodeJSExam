exports.seed = function(knex) {
    return knex('roles').select().then(roles => {
        return knex('users').insert([
            {
                role_id: roles.find(role => role.role === 'ADMIN').id,
                username: 'johndoe',
                password_hash: '$2a$12$8Zeqw2fOPgKwdwIlfcC7H.PY5nOS7gSE6COjGgO9UmtQxtdFXtX8e',
                email: 'johndoe@email.com',
            },
            {
                role_id: roles.find(role => role.role === 'USER').id,
                username: 'alice',
                password_hash: '$2a$12$IhiHybU5PdHh3.7ArXpoouY09/VmZheFjOJhDy8sfHFQ3fisYdYLm',
                email: 'alice@email.com',
            },
            {
                role_id: roles.find(role => role.role === 'USER').id,
                username: 'bob',
                password_hash: '$2a$12$X3n4K66LFhhtWOn1M/6qgeckArcJVLyU5EJWUHplIO3kZYiohUro2',
                email: 'bob@email.com',
            }
        ]);
    });
};
