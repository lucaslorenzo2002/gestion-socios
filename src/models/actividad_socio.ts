import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';
import {Socio} from './socio.js';
import {Actividad} from './actividad.js';
import {CategoriaSocio} from './categoriaSocio.js';
import { Club } from './club.js';

export const Actividad_Socio = sequelize.define('Actividad_Socio', {
	id:{
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	}
}, { 
	underscored: true,
	timestamps: false 
});

Socio.belongsToMany(Actividad, { through: Actividad_Socio, foreignKey: 'socio_id' });
Actividad.belongsToMany(Socio, { through: Actividad_Socio, foreignKey: 'actividad_id' });
Actividad_Socio.belongsTo(Socio);
Actividad_Socio.belongsTo(Actividad);
CategoriaSocio.hasMany(Actividad_Socio, {foreignKey: 'categoria_socio_id', sourceKey: 'id'});
Actividad_Socio.belongsTo(CategoriaSocio, {foreignKey: 'categoria_socio_id'});
Club.hasMany(Actividad_Socio, {foreignKey: 'club_asociado_id', sourceKey: 'id'});
Actividad_Socio.belongsTo(Club, {foreignKey: 'club_asociado_id'});
