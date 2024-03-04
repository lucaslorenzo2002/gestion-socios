import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';
import {TipoSocio} from './tipoSocio.js';
import { Actividad } from './actividad.js';
import { CategoriaSocio } from './categoriaSocio.js';
import { Club } from './club.js';

export const CuotaProgramada = sequelize.define('CuotaProgramada',{
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
	},
	tipo_de_cuota:{
		type: DataTypes.STRING,
		allowNull:false
	}
}, {
	underscored: true
});


TipoSocio.hasMany(CuotaProgramada, {foreignKey: 'tipo_socio_id', sourceKey: 'id'});
CuotaProgramada.belongsTo(TipoSocio, {foreignKey: 'tipo_socio_id', as: 'to'});

Actividad.hasMany(CuotaProgramada, {foreignKey: 'actividad_id', sourceKey: 'id'});
CuotaProgramada.belongsTo(Actividad, {foreignKey: 'actividad_id'});

CategoriaSocio.hasMany(CuotaProgramada, {foreignKey: 'categoria_id', sourceKey: 'id'});
CuotaProgramada.belongsTo(CategoriaSocio, {foreignKey: 'categoria_id'});

Club.hasMany(CuotaProgramada, {foreignKey: 'club_asociado_id', sourceKey: 'id'});
CuotaProgramada.belongsTo(Club, {foreignKey: 'club_asociado_id', as: 'club_asociado'});