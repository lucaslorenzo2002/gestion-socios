const Actividad = require('../models/actividad');
const CategoriaSocio = require('../models/categoriaSocio');
const Club = require('../models/club');
const TipoSocio = require('../models/tipoSocio');

class IncludeOptions{
	
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

module.exports = IncludeOptions;