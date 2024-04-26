import { Sequelize } from 'sequelize-typescript';
import pg from 'pg';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
dotenv.config();
let sequelizeInstance;
switch (process.env.NODE_ENV) {
    case 'development':
        sequelizeInstance = new Sequelize('gestion-socios-club-dev', 'postgres', 'Marruecos02', {
            dialectModule: pg,
            host: '127.0.0.1',
            dialect: 'postgres',
            //port: process.env.POSTGRESQL_PORT,
            logging: false
        });
        break;
    case 'production':
        sequelizeInstance = new Sequelize(process.env.PRODUCTION_DB_CONNECTION_STRING, {
            dialectModule: pg,
            dialect: 'postgres',
            logging: false,
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            },
        });
    case 'test':
        sequelizeInstance = new Sequelize({
            dialectModule: sqlite3,
            storage: ':memory:',
            dialect: 'sqlite',
            logging: false
        });
    default:
        break;
}
export default sequelizeInstance;
//# sourceMappingURL=sequelizeConfig.js.map