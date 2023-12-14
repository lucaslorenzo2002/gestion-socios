const SociosDAO = require('../database/socios');
const { uploadFile } = require('../utils/awsS3');

class SociosApi{
	constructor(){
		this.sociosDAO = new SociosDAO();
	}

	async createSocio(nroDocumento, nombres, apellido, tipoDeSocio, clubAsociado, fotoFile, fotoFileName, fotoUrl){

		if(fotoFile && fotoFileName && fotoUrl){
			await uploadFile(fotoFile, fotoFileName);
		}
		
		return await this.sociosDAO.createSocio({
			nro_documento: nroDocumento, 
			nombres, 
			apellido, 
			tipo_socio: tipoDeSocio, 
			club_asociado: clubAsociado, 
			foto_de_perfil: fotoUrl
		}); 
	}

	async getSocioById(id){
		return await this.sociosDAO.getSocioById(id);
	}

	async getSocioDeuda(id){
		return await this.sociosDAO.getSocioDeuda(id);
	}

	async filterSociosByTipo(tipoSocio){
		return await this.sociosDAO.filterSociosByTipo(tipoSocio);
	}
    
	async getAllSocios(clubAsociado){
		return await this.sociosDAO.getAllSocios(clubAsociado);
	}

	async getJugadores(clubAsociado){
		return await this.sociosDAO.getJugadores(clubAsociado);
	}

	async updateSocioDeuda(deuda, socioId, clubAsociado){
		return await this.sociosDAO.updateSocioDeuda(deuda, socioId, clubAsociado);
	}

	async darDeBaja(id){
		return await this.sociosDAO.darDeBaja(id);
	}

	async darDeAlta(id){
		return await this.sociosDAO.darDeAlta(id);
	}

	async updateSocioData(fecNacimiento, edad, sexo, esJugador, telefonoCelular, codigoPostal, direccion, ciudad, provincia, poseeObraSocial, siglas, rnos, numeroDeAfiliados, denominacionDeObraSocial, id){
		await this.sociosDAO.updateSocioData(fecNacimiento, edad, sexo, esJugador, telefonoCelular, codigoPostal, direccion, ciudad, provincia, poseeObraSocial, siglas, rnos, numeroDeAfiliados, denominacionDeObraSocial, id);
	}
/*
	async getUserByUsername(username){
		return await this.usersDAO.getUserByUsername(username);
	}

	async getUsersById(id){
		return await this.usersDAO.getUsersById(id);
	}

	async updateUserChats(userId, chatId){
	}

		await this.usersDAO.updateUserData(userId, username, fullName, fileUrl, bio, dayOfBirth);
		return await this.usersDAO.getUserById(userId);
	}

	async updateUserStatus(userId, online){
		return await this.usersDAO.updateUserStatus(userId, online);
	}

	async deleteUser(userId){
		return await this.usersDAO.deleteUser(userId);
	} */
}

module.exports = SociosApi;