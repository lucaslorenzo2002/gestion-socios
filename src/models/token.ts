import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';
import { ITokenAttributes } from '../interfaces/ITokenAttrs.js';
import { Sequelize } from 'sequelize-typescript';

export const Token = sequelize.define('Token',{
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	token:{
		type: DataTypes.TEXT,
	}
}, {
	underscored: true
});
/*  
export const buildToken = async(attrs: ITokenAttributes) =>{
	return await Token.create({attrs});
} */