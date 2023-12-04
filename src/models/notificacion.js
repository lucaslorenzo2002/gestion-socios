const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const Notificacion = sequelize.define('Notificacion',{
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	readed:{
		type: DataTypes.BOOLEAN,
		defaultValue: false
	},
	message:{
		type: DataTypes.STRING,
		allowNull: false
	}
}, {
	underscored: true,
	timestamps: false
});

module.exports = Notificacion;