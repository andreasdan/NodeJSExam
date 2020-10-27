exports.seed = function(knex) {
    return knex('boards').select().then(boards => {
        return knex('users').select().then(users => {
            return knex('threads').insert([
                {
                    board_id: boards.find(board => board.url === 't').id,
                    user_id: users.find(user => user.username === 'johndoe').id

                },
                {
                    board_id: boards.find(board => board.url === 'g').id,
                    user_id: users.find(user => user.username === 'johndoe').id
                    
                },
                {
                    board_id: boards.find(board => board.url === 's').id,
                    user_id: users.find(user => user.username === 'johndoe').id
                },
                {
                    board_id: boards.find(board => board.url === 'p').id,
                    user_id: users.find(user => user.username === 'johndoe').id
                },
                {
                    board_id: boards.find(board => board.url === 'mtv').id,
                    user_id: users.find(user => user.username === 'alice').id
                }
            ]);
        });
    });
};
