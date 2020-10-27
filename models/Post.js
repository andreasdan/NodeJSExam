const { Model } = require('objection');

class Post extends Model {
    static tableName = 'posts';

    static get relationMappings() {

        const Thread = require('./Thread.js');
        const User = require('./User.js');

        return {
            thread: {
                relation: Model.BelongsToOneRelation,
                modelClass: Thread,
                join: {
                    from: 'posts.threadId',
                    to: 'threads.id'
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'posts.userId',
                    to: 'users.id'
                }
            }
        }
    }
}

module.exports = Post;