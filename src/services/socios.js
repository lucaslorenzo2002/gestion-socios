const SociosDAO = require('../database/socios');
const { uploadFile } = require('../utils/awsS3');
const ActividadesApi = require('./actividades');

class SociosApi{
	constructor(){
		this.sociosDAO = new SociosDAO();
		this.actividadesApi = new ActividadesApi();
	}

	async createSocio(id, nombres, apellido, categoriaId, clubAsociado, fotoFile, fotoFileName, fotoUrl, tipoSocioId){

		if(fotoFile && fotoFileName && fotoUrl){
			await uploadFile(fotoFile, fotoFileName);
		}
		
		return await this.sociosDAO.createSocio({
			id, 
			nombres, 
			apellido, 
			categoria_socio_id: categoriaId, 
			club_asociado_id: clubAsociado, 
			foto_de_perfil: fotoUrl,
			tipo_socio_id: tipoSocioId
		}); 
	}

	async getSocioById(id){
		return await this.sociosDAO.getSocioById(id);
	}

	async getSocioDeuda(id){
		return await this.sociosDAO.getSocioDeuda(id);
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
		return await this.sociosDAO.updateSocioData(fecNacimiento, edad, sexo, esJugador, telefonoCelular, codigoPostal, direccion, ciudad, provincia, poseeObraSocial, siglas, rnos, numeroDeAfiliados, denominacionDeObraSocial, id);
	}

	async actualizarCategoriaDeSocio(id, categoria, club){
		return await this.sociosDAO.actualizarCategoriaDeSocio(id, categoria, club);
	}

	async actualizarTipoSocio(id, tipoSocio, club){
		return await this.sociosDAO.actualizarTipoDeSocio(id, tipoSocio, club);
	}

	async actualizarActividadesSocio(socioId, actividadId){
		await this.actividadesApi.eliminarSocioActividad(socioId);
		console.log('serv' + actividadId);
		return await this.actividadesApi.createSocioActividad(socioId, actividadId);
	}

	async filterSocios(tipoSocio, categoria, actividades, club){
		return await this.sociosDAO.filterSocios(parseInt(tipoSocio), parseInt(categoria), parseInt(actividades), club);
	}

	async filterSociosByTipo(tipoSocio, club){
		return await this.sociosDAO.filterSociosByTipo(parseInt(tipoSocio), club);
	}
}

module.exports = SociosApi;