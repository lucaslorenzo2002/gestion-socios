const TiposSocioDAO = require('../database/tipoSocio');

class TiposSocioApi{
	constructor(){
		this.tiposSocioDAO = new TiposSocioDAO();
	}

	async createTipoSocio(tipoSocio, club){
		return await this.tiposSocioDAO.createTipoSocio({tipo_socio: tipoSocio, club});
	}

	async getTiposSocio(club){
		return await this.tiposSocioDAO.getTiposSocio(club);
	}

}

module.exports = TiposSocioApi;