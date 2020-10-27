exports.seed = function (knex) {
    return knex('users').select().then(users => {
        return knex('posts').insert([{
                content: 'time to settle this: AMD or Intel?',
                thread_id: 1,
                user_id: users.find(user => user.username === 'johndoe').id
            },
            {
                content: 'Know any good games?',
                thread_id: 2,
                user_id: users.find(user => user.username === 'johndoe').id
            },
            {
                content: 'They\'re finally gonna win the PL this year',
                image: 'c877bac2c13a8fcb340dd705073785e179619bbbbb3b8776052c41ce415c4d29.png',
                thread_id: 3,
                user_id: users.find(user => user.username === 'bob').id
            },
            {
                content: 'What\'s the big difference between Java and C#?',
                thread_id: 4,
                user_id: users.find(user => user.username === 'alice').id
            }
        ]);
    });
};