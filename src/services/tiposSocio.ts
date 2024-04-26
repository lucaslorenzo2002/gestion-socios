import {TipoSocioDAO} from '../database/tipoSocio.js';
import { SociosApi } from './socios.js';

export class TiposSocioApi{
	tiposSocioDAO: TipoSocioDAO;
	sociosApi: SociosApi;
	constructor(){
		this.tiposSocioDAO = new TipoSocioDAO();
		this.sociosApi = new SociosApi();
	}

	async createTipoSocio(tipoSocio: number, club: number){
		return await this.tiposSocioDAO.createTipoSocio({tipo_socio: tipoSocio, club_asociado_id: club});
	}

	async getTiposSocio(clubAsociadoId: number){
		const tiposSocioConCantidad = [];
		const tiposDeSocio = await this.tiposSocioDAO.getTiposSocio(clubAsociadoId);

		for (const tipoDeSocio of tiposDeSocio) {
			tiposSocioConCantidad.push({
				...tipoDeSocio.dataValues,
				cantidadDeSocios: (await this.sociosApi.getAllSociosEnTipoSocio(clubAsociadoId, parseInt(tipoDeSocio.dataValues.id))).length
			})
		}
		return tiposSocioConCantidad;
	}

}