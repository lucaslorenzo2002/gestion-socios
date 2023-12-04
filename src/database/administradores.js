const Administrador = require('../models/administrador');
const logger = require('../utils/logger');

class AdministradoresDAO{

	async findAdministradorByCodigo(codigoAdministrador){
		try{
			return Administrador.findOne({
				where: {
					codigo_administrador: codigoAdministrador
				}
			});
		}catch(err){
			logger.info(err);
		}
	}

	async getAdministradorById(id){
		try{
			return Administrador.findOne({
				where: {
					id
				}
			});
		}catch(err){
			logger.info(err);
		}
	}
}

module.exports = AdministradoresDAO;