import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';
import { Club } from './club.js';

export const Administrador = sequelize.define('Administrador',{
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	codigo_administrador: {
		type: DataTypes.STRING,
		allowNull: false
	},
	mercado_pago_access_token:{
		type: DataTypes.STRING
	},
	mercado_pago_client_id:{
		type: DataTypes.STRING
	},
	mercado_pago_secret_id:{
		type: DataTypes.STRING
	},
}, {
	underscored: true
});

Club.hasMany(Administrador, {foreignKey: 'club_asociado_id', sourceKey: 'id'});
Administrador.belongsTo(Club, {foreignKey: 'club_asociado_id', as: 'club_asociado'});