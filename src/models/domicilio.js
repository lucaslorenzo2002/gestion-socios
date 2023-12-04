const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const Domicilio = sequelize.define('Domicilio',{
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	direccion:{
		type: DataTypes.STRING
	},
	ciudad:{
		type: DataTypes.STRING
	},
	provincia:{
		type: DataTypes.STRING
	},
	codigo_postal: {
		type: DataTypes.INTEGER
	}
}, {
	underscored: true
});

module.exports = Domicilio;