import { env } from './src/util/env';
import { Logger } from './src/util/logger';

export default {
    local:{
        client: "mysql2",
        connection: {
            host: env.get().db.host,
            port: env.get().db.port,
            user: env.get().db.user,
            password: env.get().db.password,
            database: env.get().db.database,
            supportBigNumbers: true,
            bigNumberStrings: true,
            multipleStatements: true,
            dateStrings: true
        },
        pool:{
            afterCreate: function(connection, callback) {
                connection.query(`SET time_zone = "${env.get().timezone}";`, function(err) {
                    if (err) {
                        Logger.warn(err, 'failed to initialize mysql database connection');
                    } else {
                        Logger.debug('mysql database connected');
                    }
                    callback(err, connection);
                });
            },
            min: env.get().db.pool.min,
            max: env.get().db.pool.max
        },
        migrations: {
            tableName: "migrations",
            directory: `${__dirname}/db/migrations`
        },
        seeds: {
            tableName: "seeds",
            directory: `${__dirname}/db/seeds`
        },
        debug: env.get().db.debug
    },
    test:{
        client: "sqlite3",
        connection: ":memory:",
        useNullAsDefault: true,
        pool: env.get().db.pool,
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