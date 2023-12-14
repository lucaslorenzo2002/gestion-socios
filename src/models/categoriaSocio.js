const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const CategoriaSocio = sequelize.define('CategoriaSocio',{
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	categoria: {
		type: DataTypes.STRING,
		allowNull: false
	},
	club:{
		type: DataTypes.STRING,
		allowNull: false
	}
}, {
	underscored: true,
	timestamps: false
});

module.exports = CategoriaSocio;