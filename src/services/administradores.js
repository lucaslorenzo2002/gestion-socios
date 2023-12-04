const AdministradoresDAO = require('../database/administradores');
const jwt = require('jsonwebtoken');

class AdministradoresApi{
	constructor(){
		this.administradoresDAO = new AdministradoresDAO();
	}

	async logInAdministrador(codigoAdministrador){
		const administrador = await this.administradoresDAO.findAdministradorByCodigo(codigoAdministrador);

		if(!administrador){
			return {success: false, message: 'codigo incorrecto'};
		}
		
		return {success: true, admin: {id: administrador.dataValues.id, clubAsociado: administrador.dataValues.club_asociado}, message: 'sesion iniciada'};
	}
    
}

module.exports = AdministradoresApi;