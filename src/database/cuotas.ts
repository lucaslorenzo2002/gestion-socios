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

export class CuotasDAO{
	categoriasSocioDAO: CategoriasSocioDAO;
	sociosDAO: SociosDAO;
	constructor(){
		this.categoriasSocioDAO = new CategoriasSocioDAO();
		this.sociosDAO = new SociosDAO();
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

	async findCuotaProgrmada(tipoSocioId, actividadId, categoriaId, club){
		try {
			if(tipoSocioId){
				return await CuotaProgramada.findOne({
					where: {
						tipo_socio_id: parseInt(tipoSocioId),
						club_asociado_id: club
					}
				});
			}else{
				return await CuotaProgramada.findOne({
					where: {
						actividad_id: parseInt(actividadId),
						categoria_id: parseInt(categoriaId) || null,
						club_asociado_id: club
					}
				});
			}
			
		} catch (err) {
			logger.info(err);
		}
	}

	async findCuotaById(id){
		try {
			return await Cuota.findOne({
				include:[
					{
						model: CuotaProgramada,
						attributes: ['tipo_socio_id', 'actividad_id', 'categoria_id'],
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

	async totalCuotasPendientes(socioId){
		try {
			return await Socio_Cuota.count({
				where: { 
					socio_id: socioId ,
					estado: 'PENDIENTE'
				},
			});
		} catch (err) {
			logger.info(err)
		}
	}

	async getMisCuotasPendientes(socioId){
		try{
			const misCuotasId = await Socio_Cuota.findAll({
				where:{
					socio_id: socioId,
					estado: 'PENDIENTE'
				}
			});
			
			const misCuotasData = [];
			for (let i = 0; i < misCuotasId.length; i++) {
				const cuota: any = await Cuota.findByPk(misCuotasId[i].dataValues.cuota_id, {
					include:[{
						model: TipoSocio,
						attributes: ['tipo_socio'],
						as: 'to'
					}]
				});
				const [dia, mes, año] = cuota.fecha_vencimiento.split('-');
				const fechaVto = new Date(año, mes - 1, dia);
				const cuotaProgramada: any = await CuotaProgramada.findOne({
					attributes: ['abono_multiple', 'maxima_cantidad_abono_multiple'],
					where:{
						tipo_socio_id: cuota.dataValues.tipo_socio_id
					}
				});

				misCuotasData.push({
					id: misCuotasId[i].dataValues.id,
					cuota: cuota.to.dataValues.tipo_socio,
					estado: fechaVto < new Date() ? 'VENCIDA' : 'PENDIENTE',
					abono_multiple: cuotaProgramada.dataValues.abono_multiple,
					max_cant_abono: cuotaProgramada.dataValues.maxima_cantidad_abono_multiple,
					monto: cuota.monto,
					fecha_emision:formatDateString(cuota.fecha_emision),
					fecha_vencimiento: cuota.fecha_vencimiento,
					cantidad: 1,
					vencida: fechaVto < new Date()
				});
			}

			return misCuotasData;
		}catch(err){
			logger.info(err);
		}
	} 

	async getLast3CuotasPagas(socioId){
		try{
			console.log(socioId)
			const misCuotasId = await Socio_Cuota.findAll({
				where:{
					socio_id: socioId,
					estado: 'PAGO'
				},
				order:[
					['fecha_pago', 'DESC']
				],
				limit: 3
			});

			const misCuotasData = [];
			for (let i = 0; i < misCuotasId.length; i++) {
				const cuota: any = await Cuota.findOne({
					include:[{
						model: CuotaProgramada,
						attributes: ['tipo_de_cuota']
					}],
					where:{
						id: misCuotasId[i].dataValues.cuota_id
					}
				});

				misCuotasData.push({
					id: misCuotasId[i].dataValues.id, 
					estado: 'PAGO',
					tipo_de_cuota: cuota.CuotaProgramada?.dataValues.tipo_de_cuota,
					monto: cuota.monto,
					fecha_emision:formatDateString(cuota.fecha_emision),
					forma_de_pago: misCuotasId[i].dataValues.forma_de_pago,
					fecha_de_pago: formatDateString(misCuotasId[i].dataValues.fecha_pago),
				});
			}

			return misCuotasData;
		}catch(err){
			logger.info(err);
		}
	} 

	//OPTIMAZAR ESTAS QUERIES: VER COMO HACER LA ASOCIACION EN SOCIO_CUOTA

	async getMisCuotasPagas(socioId){
		try{
			const misCuotasId = await Socio_Cuota.findAll({
				where:{
					socio_id: socioId,
					estado: 'PAGO'
				},
				order:[
					['fecha_pago', 'DESC']
				],
			});

			const misCuotasData = [];
				for (let i = 0; i < misCuotasId.length; i++) {
					const cuota: any = await Cuota.findOne({
						include:[
							{
								model: CuotaProgramada,
								attributes: [
									'tipo_socio_id',
									'categoria_id',
									'actividad_id',
									'tipo_de_cuota'
								],
								include:[
									{
										model: TipoSocio,
										attributes: ['tipo_socio'],
										as: 'to'
									},{
										model: Actividad,
										attributes: ['actividad']
									},{
										model: CategoriaSocio,
										attributes: ['categoria']
									}
								]
							}
						],
						where:{
							id: misCuotasId[i].dataValues.cuota_id
						}
					});
				
				misCuotasData.push({
					monto: cuota.monto,
					tipo_de_cuota: cuota.CuotaProgramada.dataValues.tipo_de_cuota,
					tipo_de_socio: cuota.CuotaProgramada.to?.dataValues.tipo_socio,
					actividad: cuota.CuotaProgramada.Actividad?.dataValues.actividad,
					categoria: cuota.CuotaProgramada.CategoriaSocio?.dataValues.categoria,
					fecha_emision:formatDateString(cuota.fecha_emision),
					fecha_vencimiento: cuota.fecha_vencimiento,
					forma_de_pago: misCuotasId[i].dataValues.forma_de_pago,
					fecha_de_pago: formatDateString(misCuotasId[i].dataValues.fecha_pago),					
				});				
			}

			return misCuotasData;
		}catch(err){
			logger.info(err);
		}
	} 

	async getAllCuotasSocio(socioId){
		try{
			const cuotasSocio = await Socio_Cuota.findAll({
				where:{
					socio_id: socioId
				},
				order:[
					['cuota_id', 'DESC']
				],
			});

			const cuotasSocioData = [];
			for (let i = 0; i < cuotasSocio.length; i++) {
				const cuota: any = await Cuota.findOne({
					include:[
						{
							model: CuotaProgramada,
							attributes: [
								'abono_multiple', 
								'maxima_cantidad_abono_multiple',
								'tipo_socio_id',
								'categoria_id',
								'actividad_id',
								'tipo_de_cuota'
							],
							include:[
								{
									model: TipoSocio,
									attributes: ['tipo_socio'],
									as: 'to'
								},{
									model: Actividad,
									attributes: ['actividad']
								},{
									model: CategoriaSocio,
									attributes: ['categoria']
								}
							]
						}
					],
					where:{
						id: cuotasSocio[i].dataValues.cuota_id
					}
				});

				const [dia, mes, año] = cuota.fecha_vencimiento.split('-');
				const fechaVto = new Date(año, mes - 1, dia);
				cuotasSocioData.push({
					id: cuotasSocio[i].dataValues.id, 
					estado: cuotasSocio[i].dataValues.estado,
					monto: cuota.monto,
					tipo_de_cuota: cuota.CuotaProgramada?.dataValues.tipo_de_cuota,
					tipo_de_socio: cuota.CuotaProgramada?.to?.dataValues.tipo_socio,
					actividad: cuota.CuotaProgramada?.Actividad?.dataValues.actividad,
					categoria: cuota.CuotaProgramada?.CategoriaSocio?.dataValues.categoria,
					fecha_emision:formatDateString(cuota.fecha_emision),
					fecha_vencimiento: cuota.fecha_vencimiento,
					forma_de_pago: cuotasSocio[i].dataValues.forma_de_pago,
					fecha_de_pago: formatDateString(cuotasSocio[i].dataValues.fecha_pago),
					abono_multiple: fechaVto > new Date() ? false : cuota.CuotaProgramada?.dataValues.abono_multiple,
					max_cant_abono: cuota.CuotaProgramada?.dataValues.maxima_cantidad_abono_multiple,
					vencida: fechaVto > new Date()
				});
				
			}

			return cuotasSocioData;
		}catch(err){
			logger.info(err);
		}
	} 

	async getAllCuotas(clubAsociado){
		try{
			const cuotas = await Cuota.findAll({
				include: [{
					model: CuotaProgramada,
					attributes: [
						'tipo_socio_id',
						'categoria_id',
						'actividad_id',
						'tipo_de_cuota'
					],include:[
						{
							model: TipoSocio,
							attributes: ['tipo_socio'],
							as: 'to'
						},{
							model: Actividad,
							attributes: ['actividad']
						},{
							model: CategoriaSocio,
							attributes: ['categoria']
						}
					]
				}],
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
			const cuotasProgramada = CuotaProgramada.findAll({
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

	async eliminarCuotaProgramada(club, tipoDeSocioId, actividadId, categoriaId){
		try {
			console.log(tipoDeSocioId, actividadId, categoriaId)

			if(tipoDeSocioId){
				console.log('hola')
				return await CuotaProgramada.destroy({
					where:{
						club_asociado_id: club,
						tipo_socio_id: tipoDeSocioId
					}
				});
			}else if(categoriaId){
				console.log('hola2')
				return await CuotaProgramada.destroy({
					where:{
						club_asociado_id: club,
						categoria_id: categoriaId,
						actividad_id: actividadId
					}
				});
			}else{
				console.log('hola3')
				return await CuotaProgramada.destroy({
					where:{
						club_asociado_id: club,
						actividad_id: actividadId
					}
				});
			}
		} catch (err) {
			logger.info(err);
		}
	}

	async actualizarValorDeCuota(club, tipoDeSocioId, actividadId, categoriaId, monto){
		try {
			if(tipoDeSocioId){
				return await CuotaProgramada.update({
					monto
				}, {
					where:{
						club_asociado_id: club,
						tipo_socio_id: tipoDeSocioId
					}
				});
			}else if(categoriaId){
				return await CuotaProgramada.update({
					monto
				}, {
					where:{
						club_asociado_id: club,
						actividad_id: actividadId,
						categoria_id: categoriaId
					}
				});
			}else{
				return await CuotaProgramada.update({
					monto
				}, {
					where:{
						club_asociado_id: club,
						actividad_id: actividadId
					}
				});
			}
			
		} catch (err) {
			logger.info(err.message);
		}
	}

}