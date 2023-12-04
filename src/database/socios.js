const Socio = require('../models/socio');
const logger = require('../utils/logger');

class SociosDAO{
	constructor(){
	}

	async createSocio(newSocio){
		try{
			return Socio.create(newSocio);
		}catch(err){
			logger.info(err);
		}
	}

	async getSocioByDocumento(nroDocumento){
		try {
			return Socio.findOne({
				where: {
					nro_documento: nroDocumento
				}
			});
		} catch (err) {
			logger.info(err);
		}
	}

	async getUserByMail(email){
		try{
			return Socio.findOne({ 
				where: { 
					email 
				} 
			});
		}catch(err){
			logger.info(err);
		}
	}

	async getSocioById(id){
		try{
			return Socio.findOne({ 
				where: { 
					id 
				}
			});
		}catch(err){
			logger.info(err);
		}
	}

	async filterSociosByTipo(tipoSocio){
		try{
			return Socio.findAll({ 
				where: { 
					tipo_socio: tipoSocio 
				}
			});
		}catch(err){
			logger.info(err);
		}
	}

	async getJugadores(clubAsociado){
		try{
			return Socio.findAll({ 
				where: { 
					club_asociado: clubAsociado,
					es_jugador: true
				}
			});
		}catch(err){
			logger.info(err);
		}
	}

	//ver como hacer la paginacion
	async getAllSocios(clubAsociado){
		try{
			return Socio.findAll({
				where: {
					club_asociado: clubAsociado
				},
				limit: 20
			});
		}catch(err){
			logger.info(err);
		}
	}

	async completeSocioRegister(nroDocumento, email, password, sexo, tipoDeDocumento, celular) {
		try {
			return Socio.update(
				{
					email,
					password,
					sexo,
					tipo_doc: tipoDeDocumento,
					telefono_celular: celular
				},
				{
					where: {
						nro_documento: nroDocumento
					}
				}
			);
		} catch (error) {
			logger.info(error);
		}
	}	

	/*async updateSocioPassword(userId, newPassword){
		try{
			return Socio.update({password: newPassword},{
				where:{
					id: userId
				}
			}
			);
		}catch(err){
			logger.info(err);
		}
	} */

	async updateSocioData(fecNacimiento, edad, sexo, esJugador, telefonoCelular, codigoPostal, direccion, ciudad, provincia, poseeObraSocial, siglas, rnos, numeroDeAfiliados, denominacionDeObraSocial, id){
		try{
			return Socio.update({
				fec_nacimiento: fecNacimiento,
				edad,
				sexo,
				es_jugador: esJugador,
				telefono_celular: telefonoCelular,
				codigo_postal: codigoPostal,
				direccion,
				ciudad,
				provincia,
				posee_obra_social: poseeObraSocial,
				siglas,
				rnos,
				numero_de_afiliados: numeroDeAfiliados,
				denominacion_de_obra_social: denominacionDeObraSocial
			}, {
				where:{
					id
				}
			});
		}catch(err){
			logger.info(err);
		}
	}

	async updateSocioDeuda(deuda, socioId){
		try{
			return Socio.update({deuda}, {
				where: {
					id: socioId
				}
			});
		}catch(err){
			logger.info(err);
		}
	}

	async deleteUser(socioId){
		try{
			return Socio.destroy({id: socioId});
		}catch(err){
			logger.info(err);
		}
	}

	async activateSocio(socioNroDocumento){
		try {
			return Socio.update({validado: true}, {
				where:{
					nro_documento: socioNroDocumento
				}
			});
		} catch (err) {
			logger.info(err);
		}
	}

	async darDeBaja(id){
		try {
			return Socio.update({estado_socio: 'BAJA'}, {
				where:{
					id
				}
			});
		} catch (err) {
			logger.info(err);
		}
	}
}

module.exports = SociosDAO;