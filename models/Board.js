const { Model } = require('objection');

class Board extends Model {
    static tableName = 'boards';

    static get relationMappings() {

        const Thread = require('./Thread.js');

        return {
            threads: {
                relation: Model.HasManyRelation,
                modelClass: Thread,
                join: {
                    from: 'boards.id',
                    to: 'threads.boardId'
                }
            }
        }
    }
}

module.exports = Board;