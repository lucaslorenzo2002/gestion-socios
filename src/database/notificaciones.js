const Notificacion = require('../models/notificacion');
const logger = require('../utils/logger');

class NotificacionesDAO{

	async createNotification(title, message, socioId){
		try{
			return Notificacion.create({title, message, socio_id: socioId});
		}catch(err){
			logger.info(err);
		}
	}

	async getMisNotificaciones(socioId){
		try{
			return Notificacion.findAll({
				where:{
					socio_id: socioId
				}
			});
		}catch(err){
			logger.info(err);
		}
	}


}

module.exports = NotificacionesDAO;