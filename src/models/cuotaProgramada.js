const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');
const TipoSocio = require('./tipoSocio');

const CuotaProgramada = sequelize.define('CuotaProgramada',{
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	monto:{
		type: DataTypes.INTEGER,
		allowNull: false
	},
	abono_multiple:{
		type: DataTypes.BOOLEAN
	},
	maxima_cantidad_abono_multiple:{
		type: DataTypes.INTEGER
	}
}, {
	underscored: true,
	timestamps: false
});


TipoSocio.hasMany(CuotaProgramada, {foreignKey: 'tipo_socio_id', sourceKey: 'id'});
CuotaProgramada.belongsTo(TipoSocio, {foreignKey: 'tipo_socio_id', sourceKey: 'id', as: 'to'});

module.exports = CuotaProgramada;