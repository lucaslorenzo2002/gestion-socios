const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const Familia = sequelize.define('Familia',{
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	}
}, {
	underscored: true
});

module.exports = Familia;