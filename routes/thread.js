const route = require('express').Router();
const publicPath = require('../config/application.js').publicPath;

const User = require('../models/User.js');
const Board = require('../models/Board.js');
const Thread = require('../models/Thread.js');
const Post = require('../models/Post.js');

const crypto = require('crypto');
const multer = require('multer');

// configure storage engine for multer image uploading
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/');
    },
    filename: (req, file, cb) => {
        const fileName = crypto.randomBytes(32).toString('hex');
        const mimeTypeArray = file.mimetype.split('/');
        if (mimeTypeArray[0] === 'image') {
            const extension = mimeTypeArray[mimeTypeArray.length - 1];
            cb(null, fileName + "." + extension);
        } else {
            cb('Cannot upload the specifik file because it has a wrong mimetype. Mimetype: ' + file.mimetype);
        }
    }
});


//confugre multer with storage engine setup
const upload = multer({
    storage: storage,
    fileSize: 10 * 1024 * 1024 //limit filesize to 10MB
});

/* Creating a new thread */
route.post('/thread/create/:board', upload.single('image'), async (req, res) => {
    const content = req.body.content;
    const boardId = req.params.board;
    const username = req.session.username;
    
    let image = null;
    if (req.file) {
        image = req.file.filename;
    }

    try {
        const users = await User.query().select('id').where('username', username).limit(1);
        Thread.query().insert({
            boardId: boardId,
            userId: users[0].id
        }).then(thread => {
            Post.query().insert({
                content,
                image,
                threadId: thread.id,
                userId: users[0].id
            }).then(post => {
                return res.redirect('/thread/' + thread.id);
            });
        });
    } catch (error) {
        return res.status(500).send({ response: 'Something went wrong querying the database' });
    }
});

/* Fetching threads */
route.get('/thread/:id', (req, res) => {
    return res.sendFile(publicPath + '/thread/thread.html');
});

route.get('/fetch/thread/:id', async (req, res) => {
    const threadId = req.params.id;
    
    try
    {
        const thread = await Thread.query().findById(threadId); //make sure thread exists before proceeding
        if (thread) {
            const boards = await Board.query().select('boards.title', 'boards.url').joinRelated('threads').where('threads.id', threadId);
            const posts = await Post.query()
                .select('posts.id', 'posts.content', 'posts.image', 'posts.createdAt', 'user.username')
                .joinRelated('user')
                .joinRelated('thread').where('thread.id', threadId)
                .orderBy('posts.createdAt');

            let response = {
                header: {
                    url: boards[0].url,
                    title: boards[0].title
                },
                posts
            }

            return res.send(response);
        } else {
            return res.status(404).send({ response: 'File not found'});
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ response: 'Something went wrong querying the database' });
    }
});

/* Make thread reply */
route.post('/thread/reply/:id', upload.single('image'), async (req, res) => {
    const threadId = req.params.id;
    const userId = req.session.userId;
    const content = req.body.content;

    let image = null;
    if (req.file) { //check if user attached an image to his/her post
        image = req.file.filename;
    }

    try {
        Post.query().insert({ content, image, threadId, userId }).then(post => {
            return res.redirect('/thread/' + threadId);
        });
    } catch (error) {
        return res.status(500).send({ response: 'Something went wrong with the database query' });
    }
});

module.exports = route;