const { Sequelize } = require('sequelize');
const pg = require('pg');
require('dotenv').config();

//DEV CONFIG
/* const sequelize = new Sequelize('gestion-socios-club-dev', 'postgres', 'Marruecos02',{
	dialectModule: pg,
	host: '127.0.0.1',
	dialect:  'postgres',
	//port: process.env.POSTGRESQL_PORT,
	logging: false
});  */

//PRODUCTION CONFIG
const sequelize = new Sequelize(process.env.PRODUCTION_DB_CONNECTION_STRING, {
	dialectModule: pg,
	dialect:  'postgres',
	port: process.env.POSTGRESQL_PORT,
	logging: false,
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false,
		},
	},
}); 

module.exports = sequelize;