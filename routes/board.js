const route = require('express').Router();
const publicPath = require('../config/application.js').publicPath;

const Board = require('../models/Board.js');
const Thread = require('../models/Thread.js');

const { raw } = require('objection');

/* Board index routes */
route.get('/', async (req, res) => {
    return res.sendFile(publicPath + '/index/index.html');
});

route.get('/fetch/boards', async (req, res) => {
    try {
        const boards = await Board.query().select('boards.url', 'boards.title', Board.relatedQuery('threads').count().as('threads'));
        return res.status(200).send(boards);
    } catch (error) {
        return res.status(500).send({ response: 'Something went wrong with the database query'});
    }
});


/* Specific board routes */
route.get('/board/:url', (req, res) => { //js script client side will fetch the content from url
    return res.sendFile(publicPath + '/board/board.html');
});

route.get('/fetch/board/:url', async (req, res) => {
    const boardUrl = req.params.url;
    try {
        const boards = await Board.query().select('id', 'title').where('url', boardUrl).limit(1);
        if (boards.length > 0) {

            let response = {
                id: boards[0].id,
                header: {
                    url: boardUrl,
                    title: boards[0].title
                }
            }

            const threads = await Thread.query().select(
                'threads.id', 'posts.content',
                raw('MIN(posts.created_at) as createdAt'),
                raw('MAX(posts.created_at) as updatedAt'), 'user.username')
                .joinRelated('posts')
                .joinRelated('user')
                .joinRelated('board')
                .where('board.url', boardUrl)
                .groupBy('threads.id').limit(25);
            
            response['threads'] = threads.reverse();

            return res.status(200).send(response);
        } else {
            return res.statsus(400).send({ response: 'No board with that URL exists'});
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ response: 'Something went wrong with the database query'});
    }
});

module.exports = route;