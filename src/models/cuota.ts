import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';
import { CuotaProgramada } from './cuotaProgramada.js';
import { Club } from './club.js';

export const Cuota = sequelize.define('Cuota',{
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	monto:{
		type: DataTypes.DOUBLE,
		allowNull: false
	},
	fecha_emision:{
		type: DataTypes.STRING,
		allowNull: false
	},
	fecha_vencimiento:{
		type: DataTypes.STRING,
		allowNull: false
	}
}, {
	underscored: true
});

CuotaProgramada.hasMany(Cuota, {foreignKey: 'cuota_programada_id', sourceKey: 'id'});
Cuota.belongsTo(CuotaProgramada, {foreignKey: 'cuota_programada_id'});

Club.hasMany(Cuota, {foreignKey: 'club_asociado_id', sourceKey: 'id'});
Cuota.belongsTo(Club, {foreignKey: 'club_asociado_id'});