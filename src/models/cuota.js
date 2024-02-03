const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');
const TipoSocio = require('./tipoSocio');

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
		type: DataTypes.STRING,
		allowNull: false
	},
	fecha_vencimiento:{
		type: DataTypes.STRING,
		allowNull: false
	},
	nro_recibo:{
		type: DataTypes.STRING
	}
}, {
	underscored: true,
	timestamps: false
});

TipoSocio.hasMany(Cuota, {foreignKey: 'tipo_socio_id', sourceKey: 'id'});
Cuota.belongsTo(TipoSocio, {foreignKey: 'tipo_socio_id', sourceKey: 'id', as: 'to'});

module.exports = Cuota;