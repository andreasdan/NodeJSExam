const route = require('express').Router();
const appConfig = require('../config/application.js');
const publicPath = appConfig.publicPath;

const User = require('../models/User.js');
const Role = require('../models/Role.js');

const bcrypt = require('bcrypt');

route.get('/login', async (req, res) => {
    return res.sendFile(publicPath + '/login/login.html');
});

route.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
        try {
            const users = await User.query().select().where('username', username).limit(1);
            if (users.length > 0) {
                const result = await bcrypt.compare(password, users[0].passwordHash);
                if (result) {
                    req.session.username = username;
                    req.session.userId = users[0].id;
                    return res.status(200).send({ response: 'Success' });
                }
            }
        } catch (error) {
            return res.status(500).send({ response: 'Something went wrong querying the database.' });
        }
    }

    // if the authentication attempt fails
    return res.status(400).send({ response: 'Wrong username and/or password.'});
});

route.get('/signup', async (req, res) => {
    return res.sendFile(publicPath + '/signup/signup.html');
});

route.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;

    if (username && password) {
        // password must be 8 chars minimum
        if (password.length < 8) {
            return res.status(400).send({ response: 'Password does not fulfil the requirements (Minimum 8 characters and both passwords must match).' });
        }

        try {
            const users = await User.query().select().where('username', username).limit(1);
            
            if (users.length > 0) {
                return res.status(400).send({ response: 'A user with that username already exists.' });
            }

            const roles = await Role.query().select().where({ role: 'USER' });
            const hashedPassword = await bcrypt.hash(password, appConfig.bcryptSaltRounds);
            const createdUser = await User.query().insert({
                roleId: roles[0].id,
                username,
                passwordHash: hashedPassword,
                email
            });

            //automatically login after creation
            req.session.username = username;
            req.session.userId = createdUser.id;

            return res.status(200).send({ response: 'Success'} );

        } catch (error) {
            console.log(error)
            return res.status(500).send({ response: 'Something went wrong with the database.' });
        }
    } else {
        return res.status(404).send({ response: 'Missing fields: username, password, email' });
    }
});

route.get('/logout', (req, res) => {
    req.session.destroy();
    return res.redirect('/login');
});

module.exports = route;