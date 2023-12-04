const NotificacionesDAO = require('../database/notificaciones');

class CuotasApi{
	constructor(){
		this.notificacionesDAO = new NotificacionesDAO();
	}

	async createNotificacion(title, message, socioId){
		return await this.notificacionesDAO.createNotification(title, message, socioId);
	}
    
}

module.exports = CuotasApi;