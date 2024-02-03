const Administrador = require('../models/administrador');
const logger = require('../utils/logger');
const IncludeOptions = require('./includeOptions');

class AdministradoresDAO{

	constructor(){
		this.getAdminIncludeOptions = new IncludeOptions;
	}

	async findAdministradorByCodigo(codigoAdministrador){
		try{
			return Administrador.findOne({
				include: this.getAdminIncludeOptions.getAdminIncludeOptions(),
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
				include: this.getAdminIncludeOptions.getAdminIncludeOptions(),
				where: {
					id
				}
			});
		}catch(err){
			logger.info(err);
		}
	}

	async getAdministradorByClubAsociado(clubAsociado){
		try{
			return Administrador.findOne({
				include: this.getAdminIncludeOptions.getAdminIncludeOptions(),
				where: {
					club_asociado: clubAsociado
				}
			});
		}catch(err){
			logger.info(err);
		}
	}
}

module.exports = AdministradoresDAO;