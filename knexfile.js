const { knexSnakeCaseMappers } = require('objection');

const credentials = require('./config/mysqlCredentials.js');

module.exports = {
    development: {
    client: 'mysql',
    connection: {
        host:     credentials.host,
        database: credentials.database,
        user:     credentials.user,
        password: credentials.password
    },
    pool: {
        min: 0, max: 10
    },
    ...knexSnakeCaseMappers()
    }
};