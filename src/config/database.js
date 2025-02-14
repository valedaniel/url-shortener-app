const dotenv = require('dotenv');

dotenv.config();
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

module.exports = {
  [process.env.NODE_ENV]: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: process.env.DATABASE_DIALECT,
    seederStorage: 'sequelize',
    migrationStorageTableName: 'SequelizeMeta',
    seederStorageTableName: 'SequelizeSeed',
  },
};
