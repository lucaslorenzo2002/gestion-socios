const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');

const Cuota = sequelize.define('Cuota',{
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	monto:{
		type: DataTypes.INTEGER,
		allowNull: false
	},
	fecha_emision:{
		type: DataTypes.DATE,
		allowNull: false
	},
	fecha_vencimiento:{
		type: DataTypes.DATE,
		allowNull: false
	},
	to:{
		type: DataTypes.STRING,
		allowNull: false
	},
	nro_recibo:{
		type: DataTypes.STRING
	},
	club:{
		type: DataTypes.STRING
	}
}, {
	underscored: true,
	timestamps: false
});

module.exports = Cuota;