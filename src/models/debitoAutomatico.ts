import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';
import { Club } from './club.js';

export const DebitoAutomatico = sequelize.define('DebitoAutomatico',{
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	}
}, {
	underscored: true,
	timestamps: false
});


Club.hasOne(DebitoAutomatico, {foreignKey: 'club_asociado_id', sourceKey: 'id'});
DebitoAutomatico.belongsTo(Club, {foreignKey: 'club_asociado_id'});