const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');
const Socio = require('./socio');
const Cuota = require('./cuota');
const CuotaProgramada = require('./cuotaProgramada');

const Socio_Cuota = sequelize.define('Socio_Cuota', {
	id:{
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	forma_de_pago:{
		type: DataTypes.STRING
	},
	estado:{
		type: DataTypes.STRING,
		defaultValue: 'PENDIENTE'
	},
	fecha_pago:{
		type: DataTypes.DATE
	},
	socio_id:{
		type: DataTypes.INTEGER,
		allowNull: false
	},
	cuota_id:{
		type: DataTypes.INTEGER,
		allowNull: false
	}
}, { 
	underscored: true,
	timestamps: false 
});

module.exports = Socio_Cuota;