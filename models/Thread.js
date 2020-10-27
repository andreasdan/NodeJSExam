const { Model } = require('objection');

class Thread extends Model {
    static tableName = 'threads';

    static get relationMappings() {

        const Board = require('./Board.js');
        const User = require('./User.js');
        const Post = require('./Post.js');

        return {
            board: {
                relation: Model.BelongsToOneRelation,
                modelClass: Board,
                join: {
                    from: 'threads.boardId',
                    to: 'boards.id'
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'threads.userId',
                    to: 'users.id'
                }
            },
            posts: {
                relation: Model.HasManyRelation,
                modelClass: Post,
                join: {
                    from: 'threads.id',
                    to: 'posts.threadId'
                }
            }
        }
    }
}

module.exports = Thread;