import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';
import { Club } from './club.js';

export const TipoSocio = sequelize.define('TipoSocio',{
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	tipo_socio: {
		type: DataTypes.STRING,
		allowNull: false
	},
	posee_cuota_inscripcion:{
		type: DataTypes.BOOLEAN,
		defaultValue: false
	}
}, {
	underscored: true,
	timestamps: false
});

Club.hasMany(TipoSocio, {foreignKey: 'club_asociado_id', sourceKey: 'id'});
TipoSocio.belongsTo(Club, {foreignKey: 'club_asociado_id'});