import { Op } from 'sequelize';
import {Actividad} from '../models/actividad.js';
import { Actividad_Socio } from '../models/actividad_socio.js';
//import {Actividad_Socio} from '../models/actividad_socio.js';
import {CategoriaSocio} from '../models/categoriaSocio.js';
import {Socio} from '../models/socio.js';
import {TipoSocio} from '../models/tipoSocio.js';
import logger from '../utils/logger.js';
import {IncludeOptions} from './includeOptions.js';
import { Grupo_familiar } from '../models/grupo_familiar.js';
import { Descuento_grupo_familiar } from '../models/descuento_grupo_familiar.js';

export class SociosDAO{
	getSocioIncludeOptions: IncludeOptions;

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

	async getSocioByEmail(email: string){
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

	async getSocioByCelular(celular: string){
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

	async filterSocios(tipoSocio: number, categoria: number, actividades: number, club: number){
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
						actividad_id: actividades
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
			}/* else if(tipoSocio && categoria && actividades){
				const idSocio = await Actividad_Socio.findAll({
					where:{
						actividad_id: actividades
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
			} */
		}catch(err){
			logger.info(err);
		}
	}

	/* async getAllActividadSocios(clubAsociado: number){
		try {
			return await Actividad_Socio.findAll({
				where:{
					club_asociado_id: clubAsociado
				}
			});
		} catch (err) {
			logger.info(err);
		}
	} */
	
	async getAllSocios(clubAsociado: number){
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

	async getAllSociosSinTipoSocio(clubAsociado: number){
		try{
			return await Socio.findAll({
				where: {
					club_asociado_id: clubAsociado,
					tipo_socio_id: null
				}
			});
		}catch(err){
			logger.info(err);
		}
	}

	async getAllSociosEnTipoSocio(clubAsociado: number, tipoSocio: number){
		try{
			return await Socio.findAll({
				where: {
					club_asociado_id: clubAsociado,
					tipo_socio_id: tipoSocio
				}
			});
		}catch(err){
			logger.info(err);
		}
	}

	async completeSocioRegister(
		nroDocumento: number, 
		email: string, 
		password: string, 
		sexo: string, 
		tipoDeDocumento: string, 
		celular: string
		) {
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

	async updateSocioPassword(socioId: number, newPassword: string){
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

	async updateSocioData(
		fecNacimiento: Date, 
		edad: number, 
		telefonoCelular: string, 
		codigoPostal: number, 
		direccion: string,
		ciudad: string,
		provincia: string,
		poseeObraSocial: boolean, 
		siglas: string, 
		rnos: string, 
		numeroDeAfiliados: number, 
		denominacionDeObraSocial: string, 
		perfilCompletado: number, 
		id: number
		){
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

	async updateSocioDeuda(deuda: number, socioId: number, clubAsociado: number){
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

	async deleteUser(socioId: number){
		try{
			return Socio.destroy({
				where:{
					id: socioId
				}				
			});
		}catch(err){
			logger.info(err);
		}
	}

	async activateSocio(socioNroDocumento: number){
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

	async darDeBaja(id: number){
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

	async darDeAlta(id: number){
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

	async actualizarCategoriaDeSocio(id: number, categoria: number, club: number){
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

	async actualizarActividadDeSocio(id: number, actividad: number, club: number){
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

	async eliminarSocioDeTipoDeSocio(id: number, tipoSocioId:number, club: number){
		try {
			return Socio.update({tipo_socio_id: null}, {
				where:{
					id,
					club_asociado_id: club,
					tipo_socio_id: tipoSocioId
				}
			});
		} catch (err) {
			logger.info(err);
		}
	}

	async agregarSocioATipoDeSocio(id: number, tipoSocioId:number, club: number){
		try {
			return Socio.update({tipo_socio_id: tipoSocioId}, {
				where:{
					id,
					club_asociado_id: club,
					tipo_socio_id: null
				}
			});
		} catch (err) {
			logger.info(err);
		}
	}

	async getSocioDeuda(id: number){
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
	 
	async filterSociosCuotaByActividad(actividadId, categoriaId, club){
		try {
			if(actividadId && !categoriaId){
				return await Actividad_Socio.findAll({
					attributes:['socio_id'],
					include: [{
						model: Socio,
						attributes: ['email', 'estado_socio', 'deuda', 'id']
					}],
					where:{
						actividad_id: actividadId,
						club_asociado_id: club
					}
				})
			}else if(actividadId && categoriaId){
				return await Actividad_Socio.findAll({
					attributes:['socio_id'],
					include: [{
						model: Socio,
						attributes: ['email', 'estado_socio', 'deuda', 'id', 'grupo_familiar_id'],
						include: [
							{
								model: Grupo_familiar,
								attributes: ['familiar_titular_id', 'descuento_id', 'id', 'cantidad_de_familiares'],
								include: [
									{
										model: Descuento_grupo_familiar,
										attributes: ['descuento_cuota']
									}
								]
							}
						],
					}],
					where:{
						actividad_id: actividadId,
						categoria_socio_id: categoriaId,
						club_asociado_id: club
					}
				})
			}
		} catch (err) {
			logger.info(err)
		}
	}

	async filterSociosCuotaByTipoSocio(tipoSocio: number, club: number){
		try {		
			return await Socio.findAll({
					attributes:['id', 'email', 'estado_socio', 'deuda', 'meses_abonados_cuota_social', 'grupo_familiar_id'],
					include: [
						{
							model: Grupo_familiar,
							attributes: ['familiar_titular_id', 'descuento_id', 'id', 'cantidad_de_familiares'],
							include: [
								{
									model: Descuento_grupo_familiar,
									attributes: ['descuento_cuota']
								}
							]
						}
					],
					where:{
						tipo_socio_id: tipoSocio,
						club_asociado_id: club
					}
				});
		} catch (err) {
			logger.info(err);
		}
	}

	async updateSocioMesesAbonadosCuotaSocial(mesesAbonados: number, clubAsociado: number, socioId: number){
		try {
			return Socio.update({meses_abonados_cuota_social: mesesAbonados},{
				where: {
					id: socioId,
					club_asociado_id: clubAsociado
				}
			});
		} catch (err) {
			logger.info(err);
		}
	}

	async getAllSociosWithEmail(clubAsociado: number){
		try {
			return await Socio.findAll({
				attributes:['id', 'nombres', 'apellido', 'email'],
				where:{
					club_asociado_id: clubAsociado,
					[Op.not]: [
						{
							email: null
						}
					]
				}
			})
		} catch (err) {
			logger.info(err)
		}
	}

	async getAllSociosWithEmailInActividadOrTipoSocio(actividadId: number, tipoSocio: number, clubAsociado: number){
		try {
			if(actividadId && tipoSocio){
				return await Socio.findAll({
					attributes:['email'],
					where:{
						actividad_id: actividadId,
						tipo_socio_id: tipoSocio,
						club_asociado_id: clubAsociado,
						[Op.not]: [
							{
								email: null
							}
						]
					}
				})
			}else if(actividadId && !tipoSocio){
				return await Socio.findAll({
					attributes:['email'],
					where:{
						actividad_id: actividadId,
						club_asociado_id: clubAsociado,
						[Op.not]: [
							{
								email: null
							}
						]
					}
				})
			}else if(!actividadId && tipoSocio){
				return await Socio.findAll({
					attributes:['email'],
					where:{
						tipo_socio_id: tipoSocio,
						club_asociado_id: clubAsociado,
						[Op.not]: [
							{
								email: null
							}
						]
					}
				})
			}else{
				return await Socio.findAll({
					attributes:['email'],
					where:{
						club_asociado_id: clubAsociado,
						[Op.not]: [
							{
								email: null
							}
						]
					}
				})
			}
			return 
		} catch (err) {
			logger.info(err)
		}
	}

	async asignarSocioAGrupoFamiliar(socioId: number, grupoFamiliarId: number, clubAsociadoId: number){
		try {
			return await Socio.update({grupo_familiar_id: grupoFamiliarId},{
				where: {
					id: socioId,
					club_asociado_id: clubAsociadoId
				}
			});
		} catch (err) {
			logger.info(err)
		}
	}

	async eliminarSocioDeGrupoFamiliar(id: number, grupoFamiliarId: number, clubAsociadoId: number){
		try {
			return await Socio.update({grupo_familiar_id: null},{
				where: {
					id,
					grupo_familiar_id: grupoFamiliarId,
					club_asociado_id: clubAsociadoId
				}
			});
		} catch (err) {
			logger.info(err)
		}
	}

	async getSociosSinGrupoFamiliar(clubAsociadoId: number){
		try {
			return await Socio.findAll({
				attributes:['id', 'nombres', 'apellido'],
				where: {
					grupo_familiar_id: null,
					club_asociado_id: clubAsociadoId
				}
			});
		} catch (err) {
			logger.info(err)
		}
	}

	async getAllFamiliaresEnGrupoFamiliar(grupoFamiliarId: number, clubAsociadoId: number){
		try {
			return await Socio.findAll({
				attributes: ['id', 'nombres', 'apellido'],
				include: [
					{
						model: Grupo_familiar,
						attributes: ['familiar_titular_id']
					}
				],
				where: {
					grupo_familiar_id: grupoFamiliarId,
					club_asociado_id: clubAsociadoId
				}
			})
		} catch (err) {
			logger.info(err)
		}
	}
}