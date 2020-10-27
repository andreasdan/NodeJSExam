const route = require('express').Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const User = require('../models/User.js');
const Key = require('../models/Key.js');

const mailer = require('../mailer.js');

const appConfig = require('../config/application.js');

/* Request key routes */
route.get('/request', (req, res) => {
    return res.sendFile(appConfig.publicPath + '/reset/request.html');
});

route.post('/request', async (req, res) => {
    const email = req.body.email;

    try {
        const users = await User.query().select().where('email', email).limit(1);

        if (users.length > 0) {
            const newKey = crypto.randomBytes(appConfig.randomKeyByteLength).toString('hex');
            const key = await Key.query().insert({
                user_id: users[0].id,
                key: newKey,
                used: false
            });
    
            mailer.sendResetEmail(email, newKey);
            return res.send({ response: 'Check your emails for a link to reset your password' });

        } else {
            return res.status(400).send({ response: 'No account with that email exists.' });
        }
    } catch (error) {
        return res.status(500).send({ response: 'An error occoured while querying the database.' });
    }
});

/* Request reset routes */
route.get('/reset/:key', (req, res) => {
    return res.sendFile(appConfig.publicPath + '/reset/reset.html');
});

route.post('/reset/:key', async (req, res) => {
    const { newPassword, repeatPassword } = req.body;
    const key = req.params.key;

    if (!newPassword === repeatPassword) {
        return res.status(400).send({ response: 'Passwords do not match' });
    }

    try {
        const keys = await Key.query().select().where('key', key).limit(1);

        if (keys.length > 0) {

            //check if the key has already been used
            if (keys[0].used) {
                return res.status(400).send({ response: 'This link has already been used. Submit a new reset request to recieve a new link.' });
            }

            //check if the change request exceeded the 15 min limit
            let created = new Date(keys[0].createdAt);
            let now = Date.now();
            let timeDifference = (now - created) / 1000 / 60; //time difference in minutes
            if (timeDifference >= 15) {
                return res.status(400).send({ response: 'This link has expired. Submit a new reset request to recieve a new link.' });
            }

            const newPasswordHash = await bcrypt.hash(newPassword, appConfig.bcryptSaltRounds);

            // run update query to set new password hash using promise
            User.query().findById(keys[0].userId).patch({
                passwordHash: newPasswordHash
            }).then(updated => {
                Key.query().findById(keys[0].id).patch({
                    used: true
                }).then(k => {
                    return res.send({ response: 'Password has been updated.' });
                });
            });
        } else {
            return res.status(400).send({ response: 'This link is invalid.' });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ response: 'An error occoured while querying the database.' });
    }
    
});

module.exports = route;