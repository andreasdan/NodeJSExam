const { Model } = require('objection');

class Key extends Model {
    static tableName = 'keys';

    static get relationMappings() {

        const User = require('./User.js');

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'keys.userId',
                    to: 'users.id'
                }
            }
        }
    };
}

module.exports = Key;