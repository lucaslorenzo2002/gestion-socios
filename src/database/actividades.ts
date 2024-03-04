import { Op } from 'sequelize';
import {Actividad} from '../models/actividad.js';
import { Actividad_Socio } from '../models/actividad_socio.js';
import {CategoriaSocio} from '../models/categoriaSocio.js';
import {Socio} from '../models/socio.js';
import logger from '../utils/logger.js';
import { CategoriaSocio_Socio } from '../models/categoriaSocio_socio.js';

export class ActividadesDAO{

	async crearActividad(actividad){
		try {
			return await Actividad.create(actividad);
		} catch (err) {
			logger.info(err);
		}
	}
 
	async crearSocioActividad(socioActividad){
		try {
			return await Actividad_Socio.create(socioActividad);
		} catch (err) {
			logger.info(err);
		}
	}

	async getAllSociosEnActividad(actividadId, clubAsociado){
		try {
				return await Actividad_Socio.findAll({
					include:[
						{
							model: Socio,
							attributes: ['id', 'nombres', 'apellido']
						}
					],
					where:{
						actividad_id: actividadId,
						club_asociado_id: clubAsociado
					}
				})
		} catch (err) {
			logger.info(err);
		}
	}

	async getCantidadDeJugadoresActividadById(id){
		try {
			return await Actividad.findByPk(id, {
				attributes:['cantidad_de_jugadores', 'limite_de_jugadores']
			});
		} catch (err) {
			logger.info(err);
		}
	}

	async actualizarActividadCantidadDeJugadores(cantidadDeJugadores, id){
		try {
			return await Actividad.update({
				cantidad_de_jugadores: cantidadDeJugadores
			}, {
				where:{
					id: id
				}
			})
		} catch (err) {
			logger.info(err);
		}
	}

	async getAllSociosSinActividad(actividadId, clubAsociado){
		try {
			const sociosEnActividad = await Actividad_Socio.findAll({
				attributes: ['socio_id'],
				where: {
					actividad_id: actividadId,
					club_asociado_id: clubAsociado
				}
			})

			if(sociosEnActividad.length === 0){
				return await Socio.findAll({
					attributes: ['id', 'nombres', 'apellido'],
					where:{
						club_asociado_id: clubAsociado
					}
				})  
			}

			const sociosEnActividadDTO = [];
			for (const socioEnActividad of sociosEnActividad) {
				sociosEnActividadDTO.push(socioEnActividad.dataValues.socio_id)
			}

			return await Socio.findAll({
				attributes: ['id', 'nombres', 'apellido'],
				where:{
					[Op.not]: [
						{
							id: { [Op.in]: sociosEnActividadDTO }
						}
					],
					club_asociado_id: clubAsociado
				}
			})  
		} catch (err) {
			logger.info(err);
		}
	}

	async getActividadByName(actividad: string){
		try {
			return await Actividad.findOne({
				attributes:['actividad'],
				where:{
					actividad
				}
			})
		} catch (err) {
			logger.info(err)
		}
	}	
	async getSocioActividad(socioId: number){
		try {
			return await Actividad_Socio.findAll({
				include:[{
					model: Actividad,
					attributes: ['actividad']
				},{
					model: Socio,
					attributes: ['nombres', 'apellido']
				},{
					model: CategoriaSocio,
					attributes: ['categoria']
				}],
				where:{
					socio_id: socioId
				}
			});
		} catch (err) {
			logger.info(err);
		}
	} 

	async eliminarSocioActividad(socioId: number, actividadId, club){
		try {
			return await Actividad_Socio.destroy({
				where:{
					socio_id: socioId,
					actividad_id: actividadId,
					club_asociado_id: club
				}
			});
		} catch (error) {
			logger.info(error.message);
		}
	}

	async getActividades(club: number){
		try {
			return await Actividad.findAll({
				order:[['createdAt', 'DESC']],
				where:{
					club_asociado_id: club
				}
			});
		} catch (err) {
			logger.info(err);
		}
	}

	async eliminarActividad(id: number, club: number){
		try {
			await Actividad_Socio.destroy({
				where:{
					actividad_id: id,
					club_asociado_id: club
				}
			})
			await CategoriaSocio_Socio.destroy({
				where:{
					actividad_id: id,
					club_asociado_id: club
				}
			})
			await CategoriaSocio.destroy({
				where:{
					actividad_id: id,
					club_asociado_id: club
				}
			})
			return await Actividad.destroy({
				where:{
					id,
					club_asociado_id: club
				}
			});
		} catch (err) {
			logger.info(err);
		}
	}
}