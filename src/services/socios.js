const SociosDAO = require('../database/socios');
const { uploadFile } = require('../utils/awsS3');
const ActividadesApi = require('./actividades');
const CategoriasSocioApi = require('./categoriasSocio');

class SociosApi{
	constructor(){
		this.sociosDAO = new SociosDAO();
		this.actividadesApi = new ActividadesApi();
		this.categoriasSocioApi = new CategoriasSocioApi();
	}

	async createSocio(id, nombres, apellido, categoriasId, clubAsociado, fotoFile, fotoFileName, fotoUrl, tipoSocioId, actividades){

		if(fotoFile && fotoFileName && fotoUrl){
			await uploadFile(fotoFile, fotoFileName);
		}

		await this.sociosDAO.createSocio({
			id, 
			nombres, 
			apellido, 
			club_asociado_id: clubAsociado, 
			foto_de_perfil: fotoUrl,
			tipo_socio_id: tipoSocioId,
			actividad_id: actividades
		}); 

		//await this.actividadesApi.createSocioActividad(id, actividades, categoriasId);(usar cuando cree multiples actividades para un socio)
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

	async updateSocioMesesAbonados(mesesAbonados, clubAsociado, socioId){
		return await this.sociosDAO.updateSocioMesesAbonados(mesesAbonados, clubAsociado, socioId);
	}

	async darDeBaja(id){
		return await this.sociosDAO.darDeBaja(id);
	}

	async darDeAlta(id){
		return await this.sociosDAO.darDeAlta(id);
	}

	async updateSocioData(fecNacimiento, edad, telefonoCelular, codigoPostal, direccion, ciudad, provincia, poseeObraSocial, siglas, rnos, numeroDeAfiliados, denominacionDeObraSocial, id){
		const bodyArray = [fecNacimiento, edad, telefonoCelular, codigoPostal, direccion, ciudad, provincia, poseeObraSocial, siglas, rnos, numeroDeAfiliados, denominacionDeObraSocial];
		let camposCompletados = 0;

		for (const campo of bodyArray) {
			if(campo !== null) {
				camposCompletados++;
			}
		}
		
		let porcentajeCamposCompletados;
		if(poseeObraSocial){
			porcentajeCamposCompletados = camposCompletados * 100 /19;
		}else{
			porcentajeCamposCompletados = (camposCompletados-4) * 100 /15;
		}

		return await this.sociosDAO.updateSocioData(fecNacimiento, edad, telefonoCelular, codigoPostal, direccion, ciudad, provincia, poseeObraSocial, siglas, rnos, numeroDeAfiliados, denominacionDeObraSocial, Math.floor(42 + porcentajeCamposCompletados) > 100 ? 100 : Math.floor(42 + porcentajeCamposCompletados), id);
	}

	async actualizarCategoriaDeSocio(id, categoria, club){
		return await this.sociosDAO.actualizarCategoriaDeSocio(id, categoria, club);
	}

	async actualizarTipoSocio(id, tipoSocio, club){
		return await this.sociosDAO.actualizarTipoDeSocio(id, tipoSocio, club);
	}

	async actualizarActividadesSocio(socioId, actividadId, club){
		return await this.sociosDAO.actualizarActividadDeSocio(socioId, actividadId, club);
	}

	async filterSocios(tipoSocio, categoria, actividades, club){
		return await this.sociosDAO.filterSocios(parseInt(tipoSocio), parseInt(categoria), parseInt(actividades), club);
	}

	async filterSociosByTipo(tipoSocio, club){
		return await this.sociosDAO.filterSociosByTipo(parseInt(tipoSocio), club);
	}
}

module.exports = SociosApi;