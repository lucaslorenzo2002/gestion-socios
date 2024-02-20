const Actividad = require('../models/actividad');
const Actividad_Socio = require('../models/actividad_socio');
const CategoriaSocio = require('../models/categoriaSocio');
const Socio = require('../models/socio');
const TipoSocio = require('../models/tipoSocio');
const logger = require('../utils/logger');
const IncludeOptions = require('./includeOptions');

class SociosDAO{

	constructor(){
		this.getSocioIncludeOptions = new IncludeOptions;
	}
	
	async createSocio(newSocio){
		try{
			return Socio.create(newSocio);
		}catch(err){
			logger.info(err);
		}
	}

	async getSocioByEmail(email){
		try{
			return await Socio.findOne({ 
				where: { 
					email 
				} 
			});
		}catch(err){
			logger.info(err);
		}
	}

	async getSocioByCelular(celular){
		try{
			return await Socio.findOne({ 
				where: { 
					telefono_celular: celular 
				} 
			});
		}catch(err){
			logger.info(err);
		}
	}

	async getSocioById(id){
		try{
			return Socio.findOne({ 
				include: this.getSocioIncludeOptions.getUserIncludeOptions(),
				where: { 
					id 
				}
			});
		}catch(err){
			logger.info(err);
		}
	}

	async filterSocios(tipoSocio, categoria, actividades, club){
		try{
			if(tipoSocio && !categoria && !actividades){
				return await Socio.findAll({
					include: this.getSocioIncludeOptions.getUserIncludeOptions(),
					where: { 
						tipo_socio_id: tipoSocio,
						club_asociado_id: club 
					}
				});
			}else if(!tipoSocio && categoria && !actividades){
				return await Socio.findAll({
					include: this.getSocioIncludeOptions.getUserIncludeOptions(), 
					where: { 
						categoria_socio_id: categoria,
						club_asociado_id: club 
					}
				});
			}else if(!tipoSocio && !categoria && actividades){
				return await Socio.findAll({
					include: this.getSocioIncludeOptions.getUserIncludeOptions(),
					where: { 
						actividad_id: actividades,
						club_asociado_id: club 
					}
				});
			}else if(tipoSocio && categoria && !actividades){
				return await Socio.findAll({ 
					include: this.getSocioIncludeOptions.getUserIncludeOptions(),
					where: { 
						categoria_socio_id: categoria,
						tipo_socio_id: tipoSocio,
						club_asociado_id: club
					}
				});
			}else if(tipoSocio && !categoria && actividades){
				return await Socio.findAll({
					include: this.getSocioIncludeOptions.getUserIncludeOptions(),
					where: { 
						tipo_socio_id: tipoSocio,
						actividad_id: actividades,
						club_asociado_id: club 
					}
				});
			}else if(!tipoSocio && categoria && actividades){
				const idSocio = await Socio.findAll({
					where:{
						actividad_id: parseInt(actividades)
					},
					attributes: ['socio_id']
				});

				const sociosFiltrados = [];

				for (let i = 0; i < idSocio.length; i++) {
					let socio = await Socio.findOne({
						include: this.getSocioIncludeOptions.getUserIncludeOptions(),
						where: {
							id: idSocio[i].dataValues.socio_id,
							categoria_socio_id: categoria,
							club_asociado_id: club 
						}
					});
					if(socio){
						sociosFiltrados.push(socio.dataValues);
					}
				}
				return sociosFiltrados;
			}else if(tipoSocio && categoria && actividades){
				const idSocio = await Actividad_Socio.findAll({
					where:{
						actividad_id: parseInt(actividades)
					},
					attributes: ['socio_id']
				});

				const sociosFiltrados = [];

				for (let i = 0; i < idSocio.length; i++) {
					let socio = await Socio.findOne({
						include: this.getSocioIncludeOptions.getUserIncludeOptions(),
						where: {
							id: idSocio[i].dataValues.socio_id,
							tipo_socio_id: tipoSocio,
							categoria_socio_id: categoria,
							club_asociado_id: club 
						}
					});
					if(socio){
						sociosFiltrados.push(socio.dataValues);
					}
				}
				return sociosFiltrados;
			}
		}catch(err){
			logger.info(err);
		}
	}

	async getAllActividadSocios(clubAsociado){
		try {
			return await Actividad_Socio.findAll({
				where:{
					club_asociado_id: clubAsociado
				}
			});
		} catch (err) {
			logger.info(err);
		}
	}
	
	async getAllSocios(clubAsociado){
		try{
			return await Socio.findAll({
				include: this.getSocioIncludeOptions.getUserIncludeOptions(),
				where: {
					club_asociado_id: clubAsociado
				}
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
					telefono_celular: celular,
					perfil_completado: 42
				},
				{
					where: {
						id: nroDocumento
					}
				}
			);
		} catch (error) {
			logger.info(error);
		}
	}	

	async updateSocioPassword(socioId, newPassword){
		try{
			return Socio.update({password: newPassword},{
				where:{
					id: socioId
				}
			}
			);
		}catch(err){
			logger.info(err);
		}
	} 

	async updateSocioData(fecNacimiento, edad, telefonoCelular, codigoPostal, direccion, ciudad, provincia, poseeObraSocial, siglas, rnos, numeroDeAfiliados, denominacionDeObraSocial, perfilCompletado, id){
		try{
			return Socio.update({
				fec_nacimiento: fecNacimiento,
				edad,
				telefono_celular: telefonoCelular,
				codigo_postal: codigoPostal,
				direccion,
				ciudad,
				provincia,
				posee_obra_social: poseeObraSocial,
				siglas,
				rnos,
				numero_de_afiliados: numeroDeAfiliados,
				denominacion_de_obra_social: denominacionDeObraSocial,
				perfil_completado: perfilCompletado
			}, {
				where:{
					id
				}
			});
		}catch(err){
			logger.info(err);
		}
	}

	async updateSocioDeuda(deuda, socioId, clubAsociado){
		try{

			return Socio.update({deuda: deuda <= 0 ? 0 : deuda}, {
				where: {
					id: socioId,
					club_asociado_id: clubAsociado
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
					id: socioNroDocumento
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
					id,
					estado_socio: 'ACTIVO'
				}
			});
		} catch (err) {
			logger.info(err);
		}
	}

	async darDeAlta(id){
		try {
			return Socio.update({estado_socio: 'ACTIVO'}, {
				where:{
					id,
					estado_socio: 'BAJA'
				}
			});
		} catch (err) {
			logger.info(err);
		}
	}

	async actualizarCategoriaDeSocio(id, categoria, club){
		try {
			return Socio.update({categoria_id: categoria}, {
				where:{
					id,
					club_asociado_id: club
				}
			});
		} catch (err) {
			logger.info(err);
		}
	}

	async actualizarActividadDeSocio(id, actividad, club){
		try {
			return Socio.update({actividad_id: actividad}, {
				where:{
					id,
					club_asociado_id: club
				}
			});
		} catch (err) {
			logger.info(err);
		}
	}

	async actualizarTipoDeSocio(id, tipoSocio, club){
		try {
			return Socio.update({tipo_socio_id: tipoSocio}, {
				where:{
					id,
					club_asociado_id: club
				}
			});
		} catch (err) {
			logger.info(err);
		}
	}

	async getSocioDeuda(id){
		try {
			return Socio.findOne({
				attributes: ['deuda'],
				where:{
					id
				}
			});
		} catch (err) {
			logger.info(err);
		}
	}

	async filterSociosByTipo(tipoSocio, club){
		try {
			return Socio.findAll({
				include: this.getSocioIncludeOptions.getUserIncludeOptions(),
				where:{
					tipo_socio_id: tipoSocio,
					club_asociado_id: club
				}
			});
		} catch (err) {
			logger.info(err);
		}
	}

	async updateSocioMesesAbonados(mesesAbonados, clubAsociado, socioId){
		try {
			return Socio.update({meses_abonados: mesesAbonados},{
				where: {
					id: socioId,
					club_asociado_id: clubAsociado
				}
			});
		} catch (err) {
			logger.info(err);
		}
	}
}

module.exports = SociosDAO;