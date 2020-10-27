const route = require('express').Router();
const publicPath = require('../config/application.js').publicPath;

const User = require('../models/User.js');

route.get('/profile', (req, res) => {
    return res.sendFile(publicPath + '/profile/profile.html');
});

route.get('/fetch/profile', async (req, res) => {
    try {
        User.query().select('users.username', 'users.email', 'role.role', User.relatedQuery('posts').count().as('postCount'))
            .joinRelated('role')
            .where('username', req.session.username)
            .limit(1)
            .then((users) => {
                return res.send(users[0]);
            });
    } catch (error) {
        console.log(error)
        return res.status(500).send({ response: 'Something went wrong querying the database' });
    }
});

module.exports = route;