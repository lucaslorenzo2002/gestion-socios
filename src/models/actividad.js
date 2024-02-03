const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const Actividad = sequelize.define('Actividad',{
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	actividad: {
		type: DataTypes.STRING,
		allowNull: false
	},
	club:{
		type: DataTypes.STRING,
		allowNull: false
	}
}, {
	timestamps: false,
	underscored: true
},
);

module.exports = Actividad;