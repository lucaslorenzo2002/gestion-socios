import {SociosDAO} from '../database/socios.js';
import { uploadFile } from '../utils/awsS3.js';

export class SociosApi{
    sociosDAO: SociosDAO
	constructor(){
		this.sociosDAO = new SociosDAO();
	}

	async createSocio(
        id: number,
        nombres: string,
        apellido: string,
        clubAsociado: number,
        fotoFile: any,
        fotoFileName: any,
        fotoUrl: any,
        socioDesde: Date
        ){

		if(fotoFile && fotoFileName && fotoUrl){
			await uploadFile(fotoFile, fotoFileName);
		}

		await this.sociosDAO.createSocio({
			id, 
			nombres, 
			apellido, 
			club_asociado_id: clubAsociado, 
			foto_de_perfil: fotoUrl,
			socio_desde: socioDesde
		}); 

	}

	async getSocioById(id:number){
		return await this.sociosDAO.getSocioById(id);
	}

	async getSocioDeuda(id: number){
		return await this.sociosDAO.getSocioDeuda(id);
	}
    
	async getAllSocios(clubAsociado: number){
		return await this.sociosDAO.getAllSocios(clubAsociado);
	}

	async getAllSociosSinTipoSocio(clubAsociado: number){
		return await this.sociosDAO.getAllSociosSinTipoSocio(clubAsociado);
	}

	async getAllSociosEnTipoSocio(clubAsociado: number, tipoSocio: number){
		return await this.sociosDAO.getAllSociosEnTipoSocio(clubAsociado, tipoSocio);
	}

	async updateSocioDeuda(deuda: number, socioId: number, clubAsociado: number){
		return await this.sociosDAO.updateSocioDeuda(deuda, socioId, clubAsociado);
	}

	async darDeBaja(id: number){
		return await this.sociosDAO.darDeBaja(id);
	}

	async darDeAlta(id: number){
		return await this.sociosDAO.darDeAlta(id);
	}

	async updateSocioData(
        fecNacimiento: Date, 
        edad: number, 
        telefonoCelular: string, 
        codigoPostal: number, 
        direccion: string, 
        ciudad: string, 
        provincia: string, 
        poseeObraSocial: boolean, 
        siglas: string, 
        rnos: string, 
        numeroDeAfiliados: number, 
        denominacionDeObraSocial: string, 
        id: number
        ){
		const bodyArray = [fecNacimiento, edad, telefonoCelular, codigoPostal, direccion, ciudad, provincia, poseeObraSocial, siglas, rnos, numeroDeAfiliados, denominacionDeObraSocial];
		let camposCompletados = 0;

		for (const campo of bodyArray) {
			if(campo !== null) {
				camposCompletados++;
			}
		}
		
		let porcentajeCamposCompletados: number;
		if(poseeObraSocial){
			porcentajeCamposCompletados = camposCompletados * 100 /19;
		}else{
			porcentajeCamposCompletados = (camposCompletados-4) * 100 /15;
		}

		return await this.sociosDAO.updateSocioData(fecNacimiento, edad, telefonoCelular, codigoPostal, direccion, ciudad, provincia, poseeObraSocial, siglas, rnos, numeroDeAfiliados, denominacionDeObraSocial, Math.floor(42 + porcentajeCamposCompletados) > 100 ? 100 : Math.floor(42 + porcentajeCamposCompletados), id);
	}

	async eliminarSocioDeTipoDeSocio(ids: number[], tipoSocioId: number, clubAsociado: number){
		for (const id of ids) {
			await this.sociosDAO.eliminarSocioDeTipoDeSocio(id, tipoSocioId, clubAsociado);	
		}
	}

	async agregarSocioATipoDeSocio(ids: number[], tipoSocioId: number, clubAsociado: number){
		for (const id of ids) {
			await this.sociosDAO.agregarSocioATipoDeSocio(id, tipoSocioId, clubAsociado);	
		}
	}

	async filterSocios(tipoSocio: number, categoria: number, actividades: number, club: number){
		return await this.sociosDAO.filterSocios(tipoSocio, categoria, actividades, club);
	}

	async filterSociosCuotaByActividad(actividad, categoria, club: number){
		return await this.sociosDAO.filterSociosCuotaByActividad(actividad, categoria, club);
	}

	async filterSociosCuotaByTipoSocio(tipoSocio: number, club: number){
		return await this.sociosDAO.filterSociosCuotaByTipoSocio(tipoSocio, club);
	}

	async updateSocioMesesAbonadosCuotaSocial(mesesAbonados: number, clubAsociado: number, socioId: number){
		return await this.sociosDAO.updateSocioMesesAbonadosCuotaSocial(mesesAbonados, clubAsociado, socioId);
	}

	async getAllSociosWithEmail(clubAsociado: number){
		return await this.sociosDAO.getAllSociosWithEmail(clubAsociado);
	}

	async getAllSociosWithEmailInActividadOrTipoSocio(actividadId: number, tipoSocio: number, clubAsociado: number){
		return await this.sociosDAO.getAllSociosWithEmailInActividadOrTipoSocio(actividadId, tipoSocio, clubAsociado);
	}

	async asignarSocioAGrupoFamiliar(socioId: number, grupoFamiliarId: number, clubAsociadoId: number){
		return await this.sociosDAO.asignarSocioAGrupoFamiliar(socioId, grupoFamiliarId, clubAsociadoId);
	}

	async eliminarSocioDeGrupoFamiliar(id: number, grupoFamiliarId: number, clubAsociadoId: number){
		return await this.sociosDAO.eliminarSocioDeGrupoFamiliar(id, grupoFamiliarId, clubAsociadoId);
	}

	async getAllSociosSinGrupoFamiliar(clubAsociadoId: number){
		return await this.sociosDAO.getSociosSinGrupoFamiliar(clubAsociadoId);
	}

	async getAllFamiliaresEnGrupoFamiliar(grupoFamiliarId: number, clubAsociadoId: number){
		return await this.sociosDAO.getAllFamiliaresEnGrupoFamiliar(grupoFamiliarId, clubAsociadoId);
	}
}