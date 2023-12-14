const CategoriaSocio = require('../models/categoriaSocio');
const logger = require('../utils/logger');

class CategoriasSocioDAO{

	async createCategoriaSocio(newCategoriaSocio){
		try{
			return await CategoriaSocio.create(newCategoriaSocio);
		}catch(err){
			logger.info(err);
		}
	}

	async getCategoriasSocio(club){
		try{
			return await CategoriaSocio.findAll({
				attributes: ['categoria', 'id'],
				where: {
					club
				}
			});
		}catch(err){
			logger.info(err);
		}
	}

}

module.exports = CategoriasSocioDAO;