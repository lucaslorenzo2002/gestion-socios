const Cuota = require('../models/cuota');
const Socio = require('../models/socio');
const Socio_Cuota = require('../models/socio_cuota');
const formatDateString = require('../utils/formatDateString');
const logger = require('../utils/logger');

class CuotasDAO{

	async createCuota(newCuota){
		try{
			return await Cuota.create(newCuota);
		}catch(err){
			logger.info(err);
		}
	}

	async createSocioCuota(id, cuotaId, socioId){
		try {
			return await Socio_Cuota.create({id, cuota_id: cuotaId, socio_id: socioId});
		} catch (err) {
			logger.info(err);
		}
	}

	async pagarCuota(formaDePago, deuda, socioId, socioCuotaId, monto){
		try{
			console.log(formaDePago, deuda, socioId, socioCuotaId, monto);
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
	
				await Socio.update({
					deuda: deuda - monto
				}, {
					where:{
						id: socioId
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

	async getAllCuotas(clubAsociado){
		try{
			return await Cuota.findAll({
				where: {
					club: clubAsociado
				}
			});
		}catch(err){
			logger.info(err);
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
				const cuota = await Cuota.findByPk(misCuotasId[i].dataValues.cuota_id);
				misCuotasData.push({
					id: misCuotasId[i].dataValues.id, 
					estado: misCuotasId[i].dataValues.estado,
					monto: cuota.monto,
					fecha_emision:formatDateString(cuota.fecha_emision),
					fecha_vencimiento: formatDateString(cuota.fecha_vencimiento),
				});
				
			}

			return misCuotasData;
		}catch(err){
			logger.info(err);
		}
	} 

	async getMisCuotasPagas(socioId){
		try{
			const misCuotasId = await Socio_Cuota.findAll({
				where:{
					socio_id: socioId,
					estado: 'PAGO'
				}
			});

			const misCuotasData = [];
			for (let i = 0; i < misCuotasId.length; i++) {
				const cuota = await Cuota.findByPk(misCuotasId[i].dataValues.cuota_id);
				misCuotasData.push({
					id: misCuotasId[i].dataValues.id, 
					estado: misCuotasId[i].dataValues.estado,
					monto: cuota.monto,
					fecha_emision:formatDateString(cuota.fecha_emision),
					banco: misCuotasId[i].dataValues.banco,
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
				}
			});

			const cuotasSocioData = [];
			for (let i = 0; i < cuotasSocio.length; i++) {
				const cuota = await Cuota.findByPk(cuotasSocio[i].dataValues.cuota_id);
				cuotasSocioData.push({
					id: cuotasSocio[i].dataValues.id, 
					estado: cuotasSocio[i].dataValues.estado,
					monto: cuota.monto,
					fecha_emision:formatDateString(cuota.fecha_emision),
					fecha_vencimiento: formatDateString(cuota.fecha_vencimiento),
					banco: cuotasSocio[i].dataValues.banco,
					forma_de_pago: cuotasSocio[i].dataValues.forma_de_pago,
					fecha_de_pago: formatDateString(cuotasSocio[i].dataValues.fecha_pago),
				});
				
			}

			return cuotasSocioData;
		}catch(err){
			logger.info(err);
		}
	} 

}

module.exports = CuotasDAO;