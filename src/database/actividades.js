const Actividad = require('../models/actividad');
const ActividadSocio = require('../models/actividad_socio');
const CategoriaSocio = require('../models/categoriaSocio');
const Socio = require('../models/socio');
const logger = require('../utils/logger');

class ActividadesDAO{

	async crearActividad(actividad){
		try {
			return await Actividad.create(actividad);
		} catch (err) {
			logger.info(err);
		}
	}

	async crearSocioActividad(socioActividad){
		try {
			return await ActividadSocio.create(socioActividad);
		} catch (err) {
			logger.info(err);
		}
	}

	async getSocioActividad(idSocio){
		try {
			return await ActividadSocio.findAll({
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
					socio_id: idSocio
				}
			});
		} catch (err) {
			logger.info(err);
		}
	}

	async eliminarSocioActividad(socioId){
		try {
			return await ActividadSocio.destroy({
				where:{
					socio_id: socioId
				}
			});
		} catch (error) {
			logger.info(error.message);
		}
	}

	async getActividades(club){
		try {
			return await Actividad.findAll({
				where:{
					club
				}
			});
		} catch (err) {
			logger.info(err);
		}
	}

	async eliminarActividad(id, club){
		try {
			return await Actividad.destroy({
				where:{
					id,
					club
				}
			});
		} catch (err) {
			logger.info(err);
		}
	}
}

module.exports = ActividadesDAO;