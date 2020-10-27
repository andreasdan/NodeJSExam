const route = require('express').Router();
const publicPath = require('../config/application.js').publicPath;

route.get('/menu', (req, res) => {
    return res.sendFile(publicPath + '/menu/menu.html');
});

module.exports = route;