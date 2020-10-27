const { Model } = require('objection');

class User extends Model {
    static tableName = 'users';

    static get relationMappings() {

        const Role = require('./Role.js');
        const Key = require('./Key.js');
        const Post = require('./Post.js');
        
        return {
            role: {
                relation: Model.BelongsToOneRelation,
                modelClass: Role,
                join: {
                    from: 'users.roleId',
                    to: 'roles.id'
                }
            },
            keys: {
                relation: Model.HasManyRelation,
                modelClass: Key,
                join: {
                    from: 'user.id',
                    to: 'keys.userId'
                }
            },
            posts: {
                relation: Model.HasManyRelation,
                modelClass: Post,
                join: {
                    from: 'users.id',
                    to: 'posts.userId'
                }
            }
        }
    }
}

module.exports = User;