import {AdministradoresDAO} from '../database/administradores.js';

export class AdministradoresApi{
	administradoresDAO: AdministradoresDAO;
	constructor(){
		this.administradoresDAO = new AdministradoresDAO();
	}

	async logInAdministrador(codigoAdministrador: number){
		const administrador = await this.administradoresDAO.findAdministradorByCodigo(codigoAdministrador);

		if(!administrador){
			return {success: false, message: 'codigo incorrecto'};
		}
		
		return {success: true, admin: {id: administrador.dataValues.id, clubAsociado: administrador.dataValues.club_asociado}, message: 'sesion iniciada'};
	}

	async getAdministradorByClubAsociado(clubAsociado: number){
		return await this.administradoresDAO.getAdministradorByClubAsociado(clubAsociado);	
	}
    
}