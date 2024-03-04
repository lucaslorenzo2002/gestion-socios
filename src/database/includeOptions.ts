import {Actividad} from '../models/actividad.js';
import {CategoriaSocio} from '../models/categoriaSocio.js';
import {Club} from '../models/club.js';
import {TipoSocio} from '../models/tipoSocio.js';

export class IncludeOptions{
	
	getUserIncludeOptions(){
		return[
			this.getTipoSocioIncludeOptions(),
			this.getClubAsociadoIncludeOptions(),
			this.getActividadIncludeOptions(),
			this.getCategoriaIncludeOptions()
		];
	}

	getAdminIncludeOptions(){
		return[
			this.getClubAsociadoIncludeOptions()
		];
	}

	getTipoSocioIncludeOptions(){
		return {
			model: TipoSocio,
			attributes: ['tipo_socio'],
			as: 'tipo_socio'
		};
	}

	getClubAsociadoIncludeOptions(){
		return {
			model: Club,
			as: 'club_asociado'
		};
	}
	
	getCategoriaIncludeOptions(){
		return{
			model: CategoriaSocio,
			as:'cat'
		};
	}

	getActividadIncludeOptions(){
		return{
			model: Actividad,
			as: 'activ'
		};
	}

}