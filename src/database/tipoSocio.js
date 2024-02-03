const TipoSocio = require('../models/tipoSocio');
const logger = require('../utils/logger');

class TipoSocioDAO{

	async createTipoSocio(tipoSocio){
		try{
			return await TipoSocio.create(tipoSocio);
		}catch(err){
			logger.info(err);
		}
	}

	async getTiposSocio(club){
		try{
			return await TipoSocio.findAll({
				attributes: ['tipo_socio', 'id'],
				where: {
					club
				}
			});
		}catch(err){
			logger.info(err);
		}
	}

}

module.exports = TipoSocioDAO;