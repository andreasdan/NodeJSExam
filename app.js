const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const moment = require('moment');

// set up helmet for better http header security
const helmet = require('helmet');
app.use(helmet());

// setup io push notifier
const notifier = require('./notifier.js');
notifier.run(io);

// json middleware
app.use(express.json());
app.use(express.static(__dirname + '/public')); //set public folder as static content holder

const appConfig = require('./config/application.js'); //application config file

// setup sessions
const session = require('express-session');
app.use(session(appConfig.session));

// setup ratelimiting for login and singup and password request routes
const rateLimit = require('express-rate-limit');
const limiter = rateLimit(appConfig.rateLimit);
app.use('/login', limiter);
app.use('/signup', limiter);
app.use('/request', limiter);

// configure objection to work with knex and knexfile config
const { Model } = require('objection');
const Knex = require('knex');
const knexFile = require('./knexfile.js');

const knex = Knex(knexFile.development);
Model.knex(knex);

const freeRoutes = ['login', 'signup', 'request', 'reset']; //non auth routes

app.use((req, res, next) => {
    // log all requests to console with moment date format
    console.log(moment().format('lll') + ": " + req.method + " " + req.originalUrl);

    const route = req.originalUrl.split('/')[1];
    //make sure the route is a free route if not authenticated
    if (!req.session.username && !freeRoutes.includes(route)) {
        return res.redirect('/login/'); //redirect to login page
    }

    next();
});

// use routes
app.use(require('./routes/auth.js'));
app.use(require('./routes/board.js'));
app.use(require('./routes/menu.js'));
app.use(require('./routes/reset.js'));
app.use(require('./routes/thread.js'));
app.use(require('./routes/user.js'));

const PORT = 3000;

server.listen(PORT, error => {
    if (error) {
        return console.log(error);
    }

    console.log('Server is running on port', PORT);
});