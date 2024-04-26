import {CategoriaSocio} from '../models/categoriaSocio.js';
import {Cuota} from '../models/cuota.js';
import {Socio} from '../models/socio.js';
import {Socio_Cuota} from '../models/socio_cuota.js';
import {CuotaProgramada} from '../models/cuotaProgramada.js';
import {formatDateString} from '../utils/formatDateString.js';
import logger from '../utils/logger.js';
import {CategoriasSocioDAO} from './categoriasSocio.js';
import {TipoSocio} from '../models/tipoSocio.js';
import {SociosDAO} from './socios.js';
import { Club } from '../models/club.js';
import { Actividad } from '../models/actividad.js';
import { Inscripcion } from '../models/inscripcion.js';
import { Op } from 'sequelize';
import { TransaccionesDAO } from './transacciones.js';
import { InscripcionesDAO } from './inscripciones.js';
import sequelizeInstance from '../config/sequelizeConfig.js';

export class CuotasDAO{
	categoriasSocioDAO: CategoriasSocioDAO;
	sociosDAO: SociosDAO;
	transaccionesDAO: TransaccionesDAO;
	constructor(){
		this.categoriasSocioDAO = new CategoriasSocioDAO();
		this.sociosDAO = new SociosDAO();
		this.transaccionesDAO = new TransaccionesDAO();
	}

	async programarCuota(newCuotaProgramada){
		try {
			return await CuotaProgramada.create(newCuotaProgramada);
		} catch (err) {
			logger.info(err);
		}
	}
	
	async createCuota(newCuota){
		try{
			return await Cuota.create(newCuota);
		}catch(err){
			logger.info(err);
		}
	}

	async createSocioCuota(newSocioCuota){
		try {
			return await Socio_Cuota.create(newSocioCuota);
		} catch (err) {
			logger.info(err);
		}
	}

	async eliminarSocioCuota(id: number){
		try {
			return await Socio_Cuota.destroy({
				where: {
					id
				}
			})
		} catch (err) {
			logger.info(err);
		}
	}

	async eliminarAllSocioCuotaByInscripcion(inscripcionId: number, clubAsociadoId: number){
		try {
			return await Socio_Cuota.destroy({
				where: {
					estado: 'PENDIENTE',
					inscripcion_id: inscripcionId
				}
			})
		} catch (err) {
			logger.info(err);
		}
	}

	async eliminarAllSocioCuotaByInscripcionInCategoria(actividadId: number, categoriaId: number, clubAsociadoId: number){
		try {
			const socios:any = await this.transaccionesDAO.sociosWithTransaccionesPendientesCuotaInscripcion(null, actividadId, categoriaId, clubAsociadoId);
			const sociosIds = socios.map(socio => socio.id);
			
			const inscripcion = await Inscripcion.findOne({
				where:{
					actividad_id: actividadId,
                    club_asociado_id: clubAsociadoId
				}
			});
			
			await Socio_Cuota.destroy({
				where:{
					estado: 'PENDIENTE',
					inscripcion_id: inscripcion.dataValues.id,
					socio_id: {
						[Op.in]: sociosIds
					}
				}
			})
		} catch (error) {
			logger.info(error)
		}
	}

	async findCuotaProgrmada(tipoSocioId: number, actividadId: number, categoriaId: number, club: number){
		try {
			if(tipoSocioId && !actividadId){
				return await CuotaProgramada.findOne({
					where: {
						tipo_socio_id: tipoSocioId,
						club_asociado_id: club
					}
				});
			}
			if(!tipoSocioId && actividadId && !categoriaId){
				return await CuotaProgramada.findOne({
					where: {
						actividad_id: actividadId,
						club_asociado_id: club
					}
				});
			}
			if(!tipoSocioId && actividadId && categoriaId){
				return await CuotaProgramada.findOne({
					where: {
						actividad_id: actividadId,
						categoria_id: categoriaId,
						club_asociado_id: club
					}
				});
			}
		} catch (err) {
			logger.info(err);
		}
	}

	async findCuotaProgramadaById(id){
		try {
			return await CuotaProgramada.findOne({
				include:[
					{
						model: Club,
						as: 'club_asociado'
					}
				],
				where:{
					id
				}
			})
		} catch (err) {
			logger.info(err);
		}
	}

	async findAllCuotasProgramadasWithAcciones(diaActual: number){
		try{
			return await CuotaProgramada.findAll({
				attributes: [
					[sequelizeInstance.fn('EXTRACT', sequelizeInstance.literal('MONTH FROM "created_at"')), 'mes'],
					'id',
					'monto',
					'interes_cuota_post_vencimiento',
					'monto_post_vencimiento',
					'actualiza_monto_cuando_vence',
					'dia_de_vencimiento'
				],
				where:{
					actualiza_monto_cuando_vence: true,
					dia_de_vencimiento: diaActual
				}
			})
		}catch(err){
			logger.info(err);
		}		
	}

	async actualizarMontoSocioCuotasVencidas(cuotaProgramadaId: number, montoVencimiento: number, interes: boolean){
		try{
			const ultimaCuotaCreadaByCuotaProgramadaId = await Cuota.findOne({
				order:[['id', 'DESC']],
				limit: 1,
				raw: true,
				where: {
					cuota_programada_id: cuotaProgramadaId
				}
			});
			
			if(interes){
				const montoSocioCuota = await Socio_Cuota.max('monto', {
					where:{
						cuota_id: ultimaCuotaCreadaByCuotaProgramadaId.id,
						estado: 'PENDIENTE'
					}
				})
				
				return await Socio_Cuota.update({monto: montoSocioCuota+montoVencimiento}, {
					where:{
						cuota_id: ultimaCuotaCreadaByCuotaProgramadaId.id,
						estado: 'PENDIENTE'
					}
				});
			}else{
				return await Socio_Cuota.update({monto: montoVencimiento}, {
					where:{
						cuota_id: ultimaCuotaCreadaByCuotaProgramadaId.id,
						estado: 'PENDIENTE'
					}
				}); 
			}
		}catch(err){
			logger.info(err);
		}
	}

	async findCuotaById(id){
		try {
			return await Cuota.findOne({
				include:[
					{
						model: CuotaProgramada,
						include: [
							{
								model: Club,
								as: 'club_asociado'
							}
						],
					}
				],
				where:{
					id
				}
			})
		} catch (err) {
			logger.info(err);
		}
	}
	
	async findCuotaByTipoAndPeriodo(periodo: string, tipoDeSocioId: number, actividadId: number, categoriaId: number, clubAsociadoId: number){
		try {
			if(tipoDeSocioId){
				return await Cuota.findOne({
					where: {
						tipo_socio_id: tipoDeSocioId,
						fecha_emision: periodo,
						club_asociado_id: clubAsociadoId
					}
				})
			}

			if(actividadId && !categoriaId){
				return await Cuota.findOne({
					where: {
						actividad_id: actividadId,
						fecha_emision: periodo,
						club_asociado_id: clubAsociadoId
					}
				})
			}

			if(categoriaId){
				return await Cuota.findOne({
					where: {
						actividad_id: actividadId,
						categoria_id: categoriaId,
						fecha_emision: periodo,
						club_asociado_id: clubAsociadoId
					}
				})
			}
		} catch (err) {
			logger.info(err);
		}
	}

	async pagarCuota(formaDePago, socioId, socioCuotaId, clubAsociado){
		try{
			const socioCuota = await this.getSocioCuota(socioCuotaId);
			if(socioCuota.dataValues.estado === 'PAGO'){
				return 'cuota ya pagada';
			}else{
				await Socio_Cuota.update({
					estado: 'PAGO',
					fecha_pago: new Date(),
					forma_de_pago: formaDePago
				}, {
					where:{
						id: socioCuotaId,
						estado: 'PENDIENTE'
					}
				});
				
			}
		}catch(err){
			logger.info(err);
		}
	}

	async getSocioCuota(id){
		try{
			return await Socio_Cuota.findOne({
				where:{
					id
				}
			});
		}catch(err){
			logger.info(err);
		}
	}

	async getSocioCuotaInscripcion(inscripcionId: number, socioId: number){
		try {
			return await Socio_Cuota.findOne({
				where: {
					inscripcion_id: inscripcionId,
					socio_id: socioId
				}
			})
		} catch (err) {
			logger.info(err);
		}
	}

	async getCuota(id){
		try{
			return await Cuota.findOne({
				where:{
					id
				}
			});
		}catch(err){
			logger.info(err);
		}
	}

	async totalCuotasPendientes(socioId: number, clubAsociadoId: number){
		try {
			const socio: any = await this.sociosDAO.getSocioById(socioId);
			const titularFamiliaId = socio.Grupo_familiar?.dataValues.familiar_titular_id;

			if(socio.dataValues.grupo_familiar_id && socio.dataValues.id !== titularFamiliaId){
				return 0
			}

			if(!socio.dataValues.grupo_familiar_id){
				return await Socio_Cuota.count({
					where: { 
						socio_id: socioId ,
						estado: 'PENDIENTE'
					},
				});
			}

			if(socio.dataValues.grupo_familiar_id && socio.dataValues.id === titularFamiliaId){
				const familiares = await this.sociosDAO.getAllFamiliaresEnGrupoFamiliar(socio.Grupo_familiar.dataValues.id, clubAsociadoId);
				const familiaresIds = familiares.map((familiar) => familiar.dataValues.id);

				return await Socio_Cuota.count({
					where: { 
						socio_id: familiaresIds,
						estado: 'PENDIENTE'
					},
				});

			}

		} catch (err) {
			logger.info(err)
		}
	}

	async getMisCuotasPendientes(socioId: number, clubAsociadoId: number) {
		try {
			const socio: any = await this.sociosDAO.getSocioById(socioId);
			const titularFamiliaId = socio.Grupo_familiar?.dataValues.familiar_titular_id;
	
			if (!socio.dataValues.grupo_familiar_id) {
				const misCuotasId: any = await Socio_Cuota.findAll({
					order:[['createdAt', 'DESC']],
					include: [
						{
							model: Cuota,
							attributes: ['tipo_de_cuota', 'fecha_vencimiento', ],
							include: [
							{
								model: TipoSocio,
								attributes: ['tipo_socio']
							}, {
								model: Actividad,
								attributes: ['actividad']
							}, {
								model: CategoriaSocio,
								attributes: ['categoria']
							}, {
								model: CuotaProgramada,
								attributes: ['maxima_cantidad_abono_multiple', 'abono_multiple']
							}
							]
						},
						{
							model: Inscripcion,
							attributes: ['tipo_de_cuota'],
							include: [
								{
									model: TipoSocio,
									attributes: ['tipo_socio']
								}, {
									model: Actividad,
									attributes: ['actividad']
								}, {
									model: CategoriaSocio,
									attributes: ['categoria']
								}
							]
						}
					],
					where: {
						socio_id: socioId,
						estado: 'PENDIENTE'
					}
				});
	
				const misCuotasDTO = [];
				for (let i = 0; i < misCuotasId.length; i++) {
					if (misCuotasId[i].dataValues.cuota_id) {
						const [dia, mes, año] = misCuotasId[i].Cuotum.fecha_vencimiento.split('-');
						const fechaVto = new Date(año, mes - 1, dia);
	
						misCuotasDTO.push({
							id: misCuotasId[i].dataValues.id,
							tipo_de_cuota: misCuotasId[i].Cuotum.dataValues.tipo_de_cuota,
							deporte: misCuotasId[i].Cuotum.Actividad?.dataValues.actividad,
							tipo_de_socio: misCuotasId[i].Cuotum.TipoSocio?.dataValues.tipo_socio,
							categoria: misCuotasId[i].Cuotum.CategoriaSocio?.dataValues.categoria,
							estado: fechaVto < new Date() ? 'VENCIDA' : 'PENDIENTE',
							abono_multiple: misCuotasId[i].Cuotum.CuotaProgramada.dataValues.abono_multiple,
							max_cant_abono: misCuotasId[i].Cuotum.CuotaProgramada.dataValues.maxima_cantidad_abono_multiple,
							monto: misCuotasId[i].dataValues.monto,
							fecha_emision: misCuotasId[i].Cuotum.dataValues.fecha_emision,
							fecha_vencimiento: misCuotasId[i].Cuotum.fecha_vencimiento,
							cantidad: 1,
							vencida: fechaVto < new Date()
						});
					} else {
	
						misCuotasDTO.push({
							id: misCuotasId[i].dataValues.id,
							tipo_de_cuota: 'cuota inscripcion',
							deporte: misCuotasId[i].Inscripcion.Actividad?.dataValues.actividad,
							tipo_de_socio: misCuotasId[i].Inscripcion.TipoSocio?.dataValues.tipo_socio,
							categoria: misCuotasId[i].Inscripcion.CategoriaSocio?.dataValues.categoria,
							estado: 'PENDIENTE',
							monto: misCuotasId[i].dataValues.monto,
							fecha_emision: misCuotasId[i].Inscripcion.dataValues.created_at
						});
					}
				}
				return misCuotasDTO;
			}
	
			if (socio.dataValues.grupo_familiar_id && socio.dataValues.id === titularFamiliaId) {
				const familiares = await this.sociosDAO.getAllFamiliaresEnGrupoFamiliar(socio.Grupo_familiar.dataValues.id, clubAsociadoId);
				const familiaresIds = familiares.map((familiar) => familiar.dataValues.id);

				const cuotasFamiliares:any = await Socio_Cuota.findAll({
					order:[['createdAt', 'DESC']],
					include: [
						{
							model:Socio,
							attributes: ['nombres', 'apellido']
						},
						{
							model: Cuota,
							attributes: ['tipo_de_cuota', 'fecha_vencimiento', ],
							include: [
							{
								model: TipoSocio,
								attributes: ['tipo_socio']
							}, {
								model: Actividad,
								attributes: ['actividad']
							}, {
								model: CategoriaSocio,
								attributes: ['categoria']
							}, {
								model: CuotaProgramada,
								attributes: ['maxima_cantidad_abono_multiple', 'abono_multiple']
							}
							]
						},
						{
							model: Inscripcion,
							attributes: ['tipo_de_cuota'],
							include: [
								{
									model: TipoSocio,
									attributes: ['tipo_socio']
								}, {
									model: Actividad,
									attributes: ['actividad']
								}, {
									model: CategoriaSocio,
									attributes: ['categoria']
								}
							]
						}
					],
					where: {
						socio_id: familiaresIds,
						estado: 'PENDIENTE'
					}
				});
			
	
				const cuotasFamiliaresDTO = [];
	
				for (const cuotaFamiliar of cuotasFamiliares) {
					const correspondeA = `${cuotaFamiliar.Socio.dataValues.nombres} ${cuotaFamiliar.Socio.dataValues.apellido}` 
					if (cuotaFamiliar.dataValues.cuota_id) {
						const [dia, mes, año] = cuotaFamiliar.Cuotum.fecha_vencimiento.split('-');
						const fechaVto = new Date(año, mes - 1, dia);
						const cuotaProgramada: any = await CuotaProgramada.findOne({
							attributes: ['abono_multiple', 'maxima_cantidad_abono_multiple'],
							where: {
								tipo_socio_id: cuotaFamiliar.Cuotum.dataValues.tipo_socio_id
							}
						});

						cuotasFamiliaresDTO.push({
							id: cuotaFamiliar.dataValues.id,
							tipo_de_cuota: cuotaFamiliar.Cuotum.dataValues.tipo_de_cuota,
							deporte: cuotaFamiliar.Cuotum.Actividad?.dataValues.actividad,
							tipo_de_socio: cuotaFamiliar.Cuotum.TipoSocio?.dataValues.tipo_socio,
							categoria: cuotaFamiliar.Cuotum.CategoriaSocio?.dataValues.categoria,
							estado: fechaVto < new Date() ? 'VENCIDA' : 'PENDIENTE',
							abono_multiple: cuotaProgramada.dataValues.abono_multiple,
							max_cant_abono: cuotaProgramada.dataValues.maxima_cantidad_abono_multiple,
							monto: cuotaFamiliar.dataValues.monto,
							fecha_emision: cuotaFamiliar.Cuotum.dataValues.fecha_emision,
							fecha_vencimiento: cuotaFamiliar.Cuotum.fecha_vencimiento,
							corresponde_a:correspondeA,
							cantidad: 1,
							vencida: fechaVto < new Date()
						});
					} else {
						cuotasFamiliaresDTO.push({
							id: cuotaFamiliar.dataValues.id,
							tipo_de_cuota: 'cuota inscripcion',
							deporte: cuotaFamiliar.Inscripcion.Actividad?.dataValues.actividad,
							tipo_de_socio: cuotaFamiliar.Inscripcion.TipoSocio?.dataValues.tipo_socio,
							categoria: cuotaFamiliar.Inscripcion.CategoriaSocio?.dataValues.categoria,
							estado: 'PENDIENTE',
							monto: cuotaFamiliar.dataValues.monto,
							fecha_emision: cuotaFamiliar.Inscripcion.dataValues.created_at,
							abono_multiple: false,
							corresponde_a: correspondeA,
							cantidad: 1
						});
					} 
				}
				return cuotasFamiliaresDTO;
			}
	
		} catch (err) {
			logger.info(err);
		}
	}
	
	async getLast3CuotasPagas(socioId: number, clubAsociadoId: number) {
		try {
			const socio: any = await this.sociosDAO.getSocioById(socioId);//(o (1))
			const titularFamiliaId = socio.Grupo_familiar?.dataValues.familiar_titular_id;
	
			if (socio.dataValues.grupo_familiar_id && socio.dataValues.id !== titularFamiliaId) {
				return [];
			}
	
			if (!socio.dataValues.grupo_familiar_id) {
				const cuotasSocio: any = await Socio_Cuota.findAll({
					include: [
						{
							model: Cuota,
							attributes: ['tipo_de_cuota', 'fecha_vencimiento', ],
							include: [
							{
								model: TipoSocio,
								attributes: ['tipo_socio']
							}, {
								model: Actividad,
								attributes: ['actividad']
							}, {
								model: CategoriaSocio,
								attributes: ['categoria']
							}, {
								model: CuotaProgramada,
								attributes: ['maxima_cantidad_abono_multiple', 'abono_multiple']
							}
							]
						},
						{
							model: Inscripcion,
							attributes: ['tipo_de_cuota'],
							include: [
								{
									model: TipoSocio,
									attributes: ['tipo_socio']
								}, {
									model: Actividad,
									attributes: ['actividad']
								}, {
									model: CategoriaSocio,
									attributes: ['categoria']
								}
							]
						}
					],
					where: {
						socio_id: socioId,
						estado: 'PAGO'
					},
					order: [
						['fecha_pago', 'DESC']
					],
					limit: 3
				});
	
				const cuotasSocioDTO = [];
				for (let i = 0; i < cuotasSocio.length; i++) {
					if (cuotasSocio[i].dataValues.cuota_id) {
						cuotasSocioDTO.push({
							id: cuotasSocio[i].dataValues.id,
							estado: 'PAGO',
							tipo_de_cuota: cuotasSocio[i].Cuotum?.dataValues.tipo_de_cuota,
							monto: cuotasSocio[i].dataValues.monto,
							fecha_emision: cuotasSocio[i].dataValues.periodo,
							forma_de_pago: cuotasSocio[i].dataValues.forma_de_pago,
							fecha_de_pago: formatDateString(cuotasSocio[i].dataValues.fecha_pago)
						});
					} else {
						cuotasSocioDTO.push({
							id: cuotasSocio[i].dataValues.id,
							estado: 'PAGO',
							tipo_de_cuota: cuotasSocio[i].Inscripcion?.dataValues.tipo_de_cuota,
							monto: cuotasSocio[i].dataValues.monto,
							forma_de_pago: cuotasSocio[i].dataValues.forma_de_pago,
							fecha_de_pago: formatDateString(cuotasSocio[i].dataValues.fecha_pago)
						});
					}
				}
				return cuotasSocioDTO;
			}
	
			if (socio.dataValues.grupo_familiar_id && socio.dataValues.id === titularFamiliaId) {
				const familiares = await this.sociosDAO.getAllFamiliaresEnGrupoFamiliar(socio.Grupo_familiar.dataValues.id, clubAsociadoId);
				const familiaresIds = familiares.map((familiar) => familiar.dataValues.id);

				const cuotasFamiliares: any = await Socio_Cuota.findAll({
					include: [
						{
							model: Cuota,
							attributes: ['tipo_de_cuota', 'fecha_vencimiento', ],
							include: [
							{
								model: TipoSocio,
								attributes: ['tipo_socio']
							}, {
								model: Actividad,
								attributes: ['actividad']
							}, {
								model: CategoriaSocio,
								attributes: ['categoria']
							}, {
								model: CuotaProgramada,
								attributes: ['maxima_cantidad_abono_multiple', 'abono_multiple']
							}
							]
						},
						{
							model: Inscripcion,
							attributes: ['tipo_de_cuota'],
							include: [
								{
									model: TipoSocio,
									attributes: ['tipo_socio']
								}, {
									model: Actividad,
									attributes: ['actividad']
								}, {
									model: CategoriaSocio,
									attributes: ['categoria']
								}
							]
						}
					],
					where: {
						socio_id: familiaresIds,
						estado: 'PAGO'
					},
					order: [
						['fecha_pago', 'DESC']
					],
					limit: 3
				});
	
				const cuotasFamiliaresDTO = [];

				for (const cuotaFamiliar of cuotasFamiliares) {
					if (cuotaFamiliar.dataValues.cuota_id) {
						cuotasFamiliaresDTO.push({
							id: cuotaFamiliar?.dataValues.id,
							estado: 'PAGO',
							tipo_de_cuota: cuotaFamiliar.Cuotum?.dataValues.tipo_de_cuota,
							monto: cuotaFamiliar?.dataValues.monto,
							fecha_emision: cuotaFamiliar?.dataValues.periodo,
							forma_de_pago: cuotaFamiliar?.dataValues.forma_de_pago,
							fecha_de_pago: formatDateString(cuotaFamiliar.dataValues.fecha_pago)
						});
					} else {
						cuotasFamiliaresDTO.push({
							id: cuotaFamiliar?.dataValues.id,
							estado: 'PAGO',
							tipo_de_cuota: cuotaFamiliar.Inscripcion?.dataValues.tipo_de_cuota,
							monto: cuotaFamiliar?.dataValues.monto,
							forma_de_pago: cuotaFamiliar?.dataValues.forma_de_pago,
							fecha_de_pago: formatDateString(cuotaFamiliar?.dataValues.fecha_pago)
						});
					}
				}

				return cuotasFamiliaresDTO;
			}
	
		} catch (err) {
			logger.info(err);
		}
	}

	async getAllCuotasSocio(socioId: number, clubAsociadoId: number){
		try{
			const socio: any = await this.sociosDAO.getSocioById(socioId);
			const titularFamiliaId = socio.Grupo_familiar?.dataValues.familiar_titular_id;
			
			const condicion = !socio.dataValues.grupo_familiar_id || socio.dataValues.grupo_familiar_id && socio.dataValues.id !== titularFamiliaId;

			if (condicion) {
				const cuotasSocio:any = await Socio_Cuota.findAll({
					order:[['createdAt', 'DESC']],
					include: [
						{
							model: Cuota,
							attributes: ['tipo_de_cuota', 'fecha_vencimiento', ],
							include: [
							{
								model: TipoSocio,
								attributes: ['tipo_socio']
							}, {
								model: Actividad,
								attributes: ['actividad']
							}, {
								model: CategoriaSocio,
								attributes: ['categoria']
							}, {
								model: CuotaProgramada,
								attributes: ['maxima_cantidad_abono_multiple', 'abono_multiple']
							}
							]
						},
						{
							model: Inscripcion,
							attributes: ['tipo_de_cuota'],
							include: [
								{
									model: TipoSocio,
									attributes: ['tipo_socio']
								}, {
									model: Actividad,
									attributes: ['actividad']
								}, {
									model: CategoriaSocio,
									attributes: ['categoria']
								}
							]
						}
					],
					where: {
						socio_id: socioId
					}
				});
				
				const cuotasSocioDTO = [];
				for (let i = 0; i < cuotasSocio.length; i++) {
					if(cuotasSocio[i].dataValues.cuota_id){
						const [dia, mes, año] = cuotasSocio[i].Cuotum?.dataValues.fecha_vencimiento.split('-');
						const fechaVto = new Date(año, mes - 1, dia);
						
						cuotasSocioDTO.push({
							id: cuotasSocio[i].dataValues.id, 
							estado: cuotasSocio[i].dataValues.estado,
							monto: cuotasSocio[i].dataValues.monto,
							tipo_de_cuota: cuotasSocio[i].Cuotum?.dataValues.tipo_de_cuota,
							tipo_de_socio: cuotasSocio[i].Cuotum?.TipoSocio?.dataValues.tipo_socio,
							actividad: cuotasSocio[i].Cuotum?.Actividad?.dataValues.actividad,
							categoria: cuotasSocio[i].Cuotum?.CategoriaSocio?.dataValues.categoria,
							fecha_emision: cuotasSocio[i].dataValues.periodo,
							fecha_vencimiento: cuotasSocio[i].Cuotum?.dataValues.fecha_vencimiento,
							forma_de_pago: cuotasSocio[i].dataValues.forma_de_pago,
							fecha_de_pago: formatDateString(cuotasSocio[i].dataValues.fecha_pago),
							abono_multiple: fechaVto < new Date() ? false : cuotasSocio[i].Cuotum?.CuotaProgramada?.dataValues.abono_multiple,
							max_cant_abono: cuotasSocio[i].Cuotum?.CuotaProgramada?.dataValues.maxima_cantidad_abono_multiple,
							vencida: fechaVto < new Date()
						});
					}else {
						cuotasSocioDTO.push({
							id: cuotasSocio[i]?.dataValues.id, 
							estado: cuotasSocio[i]?.dataValues.estado,
							monto: cuotasSocio[i]?.dataValues.monto,
							tipo_de_cuota: cuotasSocio[i].Inscripcion?.dataValues.tipo_de_cuota,
							tipo_de_socio: cuotasSocio[i].Inscripcion?.TipoSocio?.dataValues.tipo_socio,
							actividad: cuotasSocio[i].Inscripcion?.Actividad?.dataValues.actividad,
							categoria: cuotasSocio[i].Inscripcion?.CategoriaSocio?.dataValues.categoria,
							forma_de_pago: cuotasSocio[i]?.dataValues.forma_de_pago,
							fecha_de_pago: formatDateString(cuotasSocio[i]?.dataValues.fecha_pago),
							abono_multiple: false,
							max_cant_abono: 1,
							vencida: false
						});
					}
				}
				console.log(cuotasSocioDTO)
				return cuotasSocioDTO;
			}
	
			if (socio.dataValues.grupo_familiar_id && socio.dataValues.id === titularFamiliaId) {
				const familiares = await this.sociosDAO.getAllFamiliaresEnGrupoFamiliar(socio.Grupo_familiar.dataValues.id, clubAsociadoId);
				const familiaresIds = familiares.map(familiar => familiar.dataValues.id);
				
				const cuotasFamiliares:any = await Socio_Cuota.findAll({ 
					include: [
						{
							model: Socio,
							attributes: ['nombres', 'apellido']
						},
						{
							model: Cuota,
							attributes: ['tipo_de_cuota', 'fecha_vencimiento', ],
							include: [
							{
								model: TipoSocio,
								attributes: ['tipo_socio']
							}, {
								model: Actividad,
								attributes: ['actividad']
							}, {
								model: CategoriaSocio,
								attributes: ['categoria']
							}, {
								model: CuotaProgramada,
								attributes: ['maxima_cantidad_abono_multiple', 'abono_multiple']
							}
							]
						},
						{
							model: Inscripcion,
							attributes: ['tipo_de_cuota'],
							include: [
								{
									model: TipoSocio,
									attributes: ['tipo_socio']
								}, {
									model: Actividad,
									attributes: ['actividad']
								}, {
									model: CategoriaSocio,
									attributes: ['categoria']
								}
							]
						}
					],
					order:[['createdAt', 'DESC']],
					where: {
						socio_id: familiaresIds
					}
				});
	
				const cuotasFamiliaresDTO = [];

					for (const cuotaFamiliar of  cuotasFamiliares) {
						const correspondeA = `${cuotaFamiliar.Socio.dataValues.nombres} ${cuotaFamiliar.Socio.dataValues.apellido}`
						if(cuotaFamiliar.dataValues.cuota_id){
							const [dia, mes, año] = cuotaFamiliar.Cuotum?.dataValues.fecha_vencimiento.split('-');
							const fechaVto = new Date(año, mes - 1, dia);
		
							cuotasFamiliaresDTO.push({
								id: cuotaFamiliar?.dataValues.id, 
								estado: cuotaFamiliar?.dataValues.estado,
								monto: cuotaFamiliar?.dataValues.monto,
								tipo_de_cuota: cuotaFamiliar.Cuotum?.dataValues.tipo_de_cuota,
								tipo_de_socio: cuotaFamiliar.Cuotum?.TipoSocio?.dataValues.tipo_socio,
								actividad: cuotaFamiliar.Cuotum?.Actividad?.dataValues.actividad,
								categoria: cuotaFamiliar.Cuotum?.CategoriaSocio?.dataValues.categoria,
								fecha_emision: cuotaFamiliar.dataValues.periodo,
								fecha_vencimiento: cuotaFamiliar.Cuotum?.dataValues.fecha_vencimiento,
								forma_de_pago: cuotaFamiliar?.dataValues.forma_de_pago,
								fecha_de_pago: formatDateString(cuotaFamiliar?.dataValues.fecha_pago),
								abono_multiple: fechaVto < new Date() ? false : cuotaFamiliar.Cuotum?.CuotaProgramada?.dataValues.abono_multiple,
								max_cant_abono: cuotaFamiliar.Cuotum?.CuotaProgramada?.dataValues.maxima_cantidad_abono_multiple,
								corresponde_a:correspondeA,
								vencida: fechaVto < new Date()
							});
						}else{
							cuotasFamiliaresDTO.push({
								id: cuotaFamiliar?.dataValues.id, 
								estado: cuotaFamiliar?.dataValues.estado,
								monto: cuotaFamiliar?.dataValues.monto,
								tipo_de_cuota: cuotaFamiliar.Inscripcion?.dataValues.tipo_de_cuota,
								tipo_de_socio: cuotaFamiliar.Inscripcion?.TipoSocio?.dataValues.tipo_socio,
								actividad: cuotaFamiliar.Inscripcion?.Actividad?.dataValues.actividad,
								categoria: cuotaFamiliar.Inscripcion?.CategoriaSocio?.dataValues.categoria,
								forma_de_pago: cuotaFamiliar?.dataValues.forma_de_pago,
								fecha_de_pago: formatDateString(cuotaFamiliar?.dataValues.fecha_pago),
								abono_multiple: false,
								max_cant_abono: 1,
								corresponde_a:correspondeA,
								vencida: false
							});
						}
					}
					return cuotasFamiliaresDTO;
			}	
			
		}catch(err){
			logger.info(err);
		}
	} 

	async getAllCuotas(clubAsociado){
		try{
			const cuotas = await Cuota.findAll({
				include:[
						{
							model: TipoSocio,
							attributes: ['tipo_socio']
						},{
							model: Actividad,
							attributes: ['actividad']
						},{
							model: CategoriaSocio,
							attributes: ['categoria']
						}
					],
				where: {
					club_asociado_id: clubAsociado
				},
				order: [['id', 'DESC']]
			});
			if(!cuotas) return 'el club no genero ninguna cuota';
			return cuotas;
		}catch(err){
			logger.info(err);
		}
	}

	async getCuotasProgramadas(club){
		try {
			const cuotasProgramada = await CuotaProgramada.findAll({
				order:[['created_at', 'DESC']],
				include: [{
					model: TipoSocio,
					attributes: ['tipo_socio'],
					as: 'to'
				}, {
					model: Actividad,
					attributes: ['actividad']
				}, {
					model: CategoriaSocio,
					attributes: ['categoria']
				}],
				where:{
					club_asociado_id: club
				}
			});
			if(!cuotasProgramada) return 'el club no posee cuotas programadas';

			return cuotasProgramada;
		} catch (err) {
			logger.info(err);
		}
	}

	async eliminarCuotaProgramada(club: number, tipoDeSocioId: number, actividadId: number, categoriaId: number){
		try {
			if(tipoDeSocioId && !actividadId){
				const cuotas = await Cuota.findAll({
					where:{
						tipo_socio_id: tipoDeSocioId
					}
				})
				const cuotasId = cuotas.map(cuota => cuota.dataValues.id);
				await CuotaProgramada.destroy({
					where:{
						club_asociado_id: club,
						tipo_socio_id: tipoDeSocioId
					}
				});

				await Socio_Cuota.destroy({
					where: {
						cuota_id:{
							[Op.in]: cuotasId
						},
						estado: 'PENDIENTE'
					}
				})
			}
			if(!tipoDeSocioId && actividadId && !categoriaId){
				const cuotas = await Cuota.findAll({
					where:{
						actividad_id: actividadId,
						club_asociado_id: club
					}
				});
				const cuotasId = cuotas.map(cuota => cuota.dataValues.id);
				await CuotaProgramada.destroy({
					where:{
						club_asociado_id: club,
						actividad_id: actividadId
					}
				});
				await Socio_Cuota.destroy({
					where: {
						cuota_id:{
							[Op.in]: cuotasId
						},
						estado: 'PENDIENTE'
					}
				})
			}
			if(!tipoDeSocioId && actividadId && categoriaId){
				const cuotas = await Cuota.findAll({
					where:{
						actividad_id: actividadId,
						club_asociado_id: club,
						categoria_id: categoriaId
					}
				});
				const cuotasId = cuotas.map(cuota => cuota.dataValues.id);
				await CuotaProgramada.destroy({
					where:{
						club_asociado_id: club,
						categoria_id: categoriaId,
						actividad_id: actividadId
					}
				});
				await Socio_Cuota.destroy({
					where: {
						cuota_id:{
							[Op.in]: cuotasId
						},
						estado: 'PENDIENTE'
					}
				})
			}
		} catch (err) {
			logger.info(err);
		}
	}

	async actualizarValorDeCuota(club:number, id: number, monto: number, diaDeVencimiento: string){
		try {
			await CuotaProgramada.update({
				monto,
				dia_de_vencimiento: diaDeVencimiento
			}, {
				where:{
					club_asociado_id: club,
					id
				}
			});
		} catch (err) {
			logger.info(err.message);
		}
	}

}