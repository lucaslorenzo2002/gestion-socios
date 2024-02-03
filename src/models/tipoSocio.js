const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const TipoSocio = sequelize.define('TipoSocio',{
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	tipo_socio: {
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

module.exports = TipoSocio;