const Actividad = require('../models/actividad');
const CategoriaSocio = require('../models/categoriaSocio');
const Club = require('../models/club');
const TipoSocio = require('../models/tipoSocio');

class IncludeOptions{
	
	getUserIncludeOptions(){
		return[
			this.getTipoSocioIncludeOptions(),
			this.getCategoriaSocioIncludeOptions(),
			this.getActvidadesSocioIncludeOptions(),
			this.getClubAsociadoIncludeOptions()
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

	getCategoriaSocioIncludeOptions(){
		return {
			model: CategoriaSocio,
			attributes: ['categoria'],
			as: 'categoria'
		};
	}

	getActvidadesSocioIncludeOptions(){
		return {
			model: Actividad,
			attributes: ['actividad']
		};
	}

	getClubAsociadoIncludeOptions(){
		return {
			model: Club,
			as: 'club_asociado'
		};
	}
}

module.exports = IncludeOptions;