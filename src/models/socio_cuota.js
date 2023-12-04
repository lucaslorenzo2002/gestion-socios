const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');
const Socio = require('./socio');
const Cuota = require('./cuota');

const Socio_Cuota = sequelize.define('Socio_Cuota', {
	id:{
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	forma_de_pago:{
		type: DataTypes.STRING
	},
	banco:{
		type: DataTypes.STRING
	},
	estado:{
		type: DataTypes.STRING,
		defaultValue: 'PENDIENTE'
	},
	fecha_pago:{
		type: DataTypes.DATE
	}
}, { 
	underscored: true,
	timestamps: false 
});

Socio.belongsToMany(Cuota, { through: Socio_Cuota, foreignKey: 'socio_id' });
Cuota.belongsToMany(Socio, { through: Socio_Cuota, foreignKey: 'cuota_id' });

module.exports = Socio_Cuota;