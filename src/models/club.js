const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const Club = sequelize.define('Club',{
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	nombre:{
		type: DataTypes.TEXT,
		allowNull: false
	},
	plan:{
		type: DataTypes.TEXT,
		allowNull: false
	}
}, {
	underscored: true,
	timestamps: false
});


module.exports = Club;