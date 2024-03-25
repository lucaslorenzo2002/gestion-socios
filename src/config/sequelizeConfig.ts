import { Sequelize } from 'sequelize-typescript';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config(); 

//DEV CONFIG
export default new Sequelize('gestion-socios-club-dev', 'postgres', 'Marruecos02',{
	dialectModule: pg,
	host: '127.0.0.1',
	dialect:  'postgres',
	//port: process.env.POSTGRESQL_PORT,
	logging: false
});

//PRODUCTION CONFIG

/* export default new Sequelize(process.env.PRODUCTION_DB_CONNECTION_STRING, {
	dialectModule: pg,
	dialect:  'postgres',
	logging: false,
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false,
		},
	},
});   */