const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const Administrador = sequelize.define('Administrador',{
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	codigo_administrador: {
		type: DataTypes.STRING,
		allowNull: false
	},
	mercado_pago_access_token:{
		type: DataTypes.STRING
	},
	mercado_pago_client_id:{
		type: DataTypes.STRING
	},
	mercado_pago_secret_id:{
		type: DataTypes.STRING
	},
}, {
	underscored: true
});

module.exports = Administrador;