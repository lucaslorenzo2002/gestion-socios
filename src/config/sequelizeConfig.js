const { Sequelize } = require('sequelize');
const pg = require('pg');

const sequelize = new Sequelize('gestion-socios-club-dev', 'postgres', 'Marruecos02',{
	dialectModule: pg,
	host: '127.0.0.1',
	dialect:  'postgres',
	//port: process.env.POSTGRESQL_PORT,
/* 	logging: false,
	ssl: true,
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false
		}
	} */
});

module.exports = sequelize;