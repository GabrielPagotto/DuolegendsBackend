import { Sequelize } from "sequelize";

export function initDatabase(): Sequelize {
    const dbConfig = require("../configs/db.config");
    if (!dbConfig.dialect) {
        throw new Error("The database dialect was not informed in the environment variables. [DATABASE_DIALECT]");
    } else if (!dbConfig.username) {
        throw new Error("The database username was not informed in the environment variables. [DATABASE_USERNAME]");
    } else if (!dbConfig.password) {
        throw new Error("The database password was not informed in the environment variables. [DATABASE_PASSWORD]");
    } else if (!dbConfig.host) {
        throw new Error("The database host was not informed in the environment variables. [DATABASE_HOST]");
    } else if (!dbConfig.port) {
        throw new Error("The database port was not informed in the environment variables. [DATABASE_PORT]");
    } else if (!dbConfig.database) {
        throw new Error("The database name was not informed in the environment variables. [DATABASE_NAME]");
    }
    const connectionUri: string = `${dbConfig.dialect}://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;
    const connection = new Sequelize(connectionUri, {
        define: dbConfig.define,
    });
    return connection;
}
