import { env } from './src/util/env';
import { Logger } from './src/util/logger';

export default {
    local:{
        client: "mysql2",
        connection: {
            host: env.db.host,
            port: env.db.port,
            user: env.db.user,
            password: env.db.password,
            database: env.db.database,
            supportBigNumbers: true,
            bigNumberStrings: true,
            multipleStatements: true,
            dateStrings: true
        },
        pool:{
            afterCreate: function(connection, callback) {
                connection.query(`SET time_zone = "${env.timezone}";`, function(err) {
                    if (err) {
                        Logger.warn(err, 'failed to initialize mysql database connection');
                    } else {
                        Logger.debug('mysql database connected');
                    }
                    callback(err, connection);
                });
            },
            min: env.db.pool.min,
            max: env.db.pool.max
        },
        migrations: {
            tableName: "migrations",
            directory: `${__dirname}/db/migrations`
        },
        seeds: {
            tableName: "seeds",
            directory: `${__dirname}/db/seeds`
        },
        debug: env.db.debug
    },
    test:{
        client: "sqlite3",
        connection: ":memory:",
        useNullAsDefault: true,
        pool: env.db.pool,
        migrations: {
            tableName: "migrations",
            directory: `${__dirname}/db/migrations`
        },
        seeds: {
            tableName: "seeds",
            directory: `${__dirname}/db/seeds`
        },
    }
};