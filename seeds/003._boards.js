exports.seed = function(knex) {
    return knex('boards').insert([
        { title: 'Technology', url: 't' },
        { title: 'Games', url: 'g' },
        { title: 'Sport', url: 's' },
        { title: 'Programming', url: 'p' },
        { title: 'Movies & TV', url: 'mtv' }
    ]);
};