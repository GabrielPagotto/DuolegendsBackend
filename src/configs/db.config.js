const dotenv = require('dotenv');

dotenv.config();

const databaseConfiguration = {
    dialect: process.env.DATABASE_DIALECT,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    define: {
        timestamp: true,
        underscored: true,
    }
};

module.exports = databaseConfiguration;
