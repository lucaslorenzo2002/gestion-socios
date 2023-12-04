const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const Administrador = sequelize.define('Administrador',{
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	club_asociado:{
		type: DataTypes.STRING
	},
	codigo_administrador: {
		type: DataTypes.STRING,
		allowNull: false
	}
}, {
	underscored: true
});

module.exports = Administrador;