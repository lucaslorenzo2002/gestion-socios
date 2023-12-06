const NotificacionesDAO = require('../database/notificaciones');

class NotificacionesApi{
	constructor(){
		this.notificacionesDAO = new NotificacionesDAO();
	}

	async createNotificacion(title, message, socioId){
		return await this.notificacionesDAO.createNotification(title, message, socioId);
	}
    
}

module.exports = NotificacionesApi;