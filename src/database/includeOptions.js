const Actividad = require('../models/actividad');
const CategoriaSocio = require('../models/categoriaSocio');
const Club = require('../models/club');
const TipoSocio = require('../models/tipoSocio');

class IncludeOptions{
	
	getUserIncludeOptions(){
		return[
			this.getTipoSocioIncludeOptions(),
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

	getActvidadesSocioIncludeOptions(){
		return {
			model: Actividad,
			attributes: ['actividad'],
			include: [
				this.getCategoriaSocioIncludeOptions()
			]
		};
	}

	getClubAsociadoIncludeOptions(){
		return {
			model: Club,
			as: 'club_asociado'
		};
	}

	getCategoriaSocioIncludeOptions(){
		return {
			model: CategoriaSocio,
			attributes: ['categoria', 'id']
		};
	}
}

module.exports = IncludeOptions;