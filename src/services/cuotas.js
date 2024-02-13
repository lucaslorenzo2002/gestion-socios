const CuotasDAO = require('../database/cuotas');
const SociosApi = require('../services/socios');
const sendEmail = require('../utils/sendEmail');
const CategoriasSocioDAO = require('./categoriasSocio');
const moment = require('moment');
const cron = require('node-cron');

class CuotasApi{
	constructor(){
		this.cuotasDAO = new CuotasDAO();
		this.sociosApi = new SociosApi();
		this.categoriasSocioDAO = new CategoriasSocioDAO();
		this.jobsMap = new Map();
	}

	//Cron job
	async asignarCuotaASocios(cuota, club){
		try {
			const sociosTarget = await this.sociosApi.filterSociosByTipo(cuota.dataValues.tipo_socio_id, club.id);	
			const sociosIds = sociosTarget.map(socio => socio.dataValues.id);

			//Mail
			let message = `
        	<h2>PORFAVOR NO RESPONDER ESTE MENSAJE</h2>
        	<p>Estimado socio, se envia este mail para hacerle saber que tiene una nueva cuota.</p>
        	<p>Para pagar la misma debera ingresar a la aplicacion.</p> 
        	<p>Muchas gracias</p> 
        	<p>Administracion club ${club.nombre}</p> `
			;
			let from = process.env.EMAIL_USER;
			let subject = `${club.nombre}, AVISO DE NUEVA CUOTA`;

			for (let i = 0; i < sociosIds.length; i++) {		
				if(sociosTarget[i].dataValues.estado_socio === 'ACTIVO' && sociosTarget[i].dataValues.meses_abonados === 0){
					await this.sociosApi.updateSocioDeuda(sociosTarget[i].dataValues.deuda + cuota.dataValues.monto, sociosIds[i], club.id);		
					let emailTo = sociosTarget[i].dataValues.email;
					await sendEmail(from, emailTo, subject, message);
					let socioIdString = sociosIds[i].toString().slice(-4);
					this.cuotasDAO.createSocioCuota({id: parseInt(`${cuota.dataValues.id}${socioIdString}`), cuota_id: cuota.dataValues.id, socio_id: sociosIds[i]});
				}else if(sociosTarget[i].dataValues.meses_abonados > 0){
					await this.sociosApi.updateSocioMesesAbonados(sociosTarget[i].dataValues.meses_abonados - 1, club.id, sociosIds[i]);
				}
			}
		} catch (err) {
			console.log(err.message);
		}
	}

	async programarCuota(fechaEmision, monto, to, abonoMultiple, maxCantAbonoMult, club){
		try {
			const cuotaYaExistente = await this.cuotasDAO.findCuotaProgrmada(to, club.id);
			if(cuotaYaExistente) return true;
			
			//arreglar lo antes posible
			const mesCuota = [fechaEmision[3], fechaEmision[4]].join('');
			const mesCuotaNum = parseInt(mesCuota);
			let anio;
			let fechaVencimiento;
			if(mesCuotaNum+1 === 13){
				anio = 2025;
				fechaVencimiento = `10-01-${anio}`;
			}else{
				anio = 2024;
				fechaVencimiento = `10-${mesCuotaNum+1}-${anio}`;
			}
	
			const fechaEmisionMoment = moment(fechaEmision, 'DD-MM-YYYY');
		
			if(fechaEmisionMoment.isSameOrBefore(moment())){
				const cuota = await this.cuotasDAO.createCuota({monto, tipo_socio_id: parseInt(to), club_asociado_id:club.id, fecha_emision: fechaEmision, fecha_vencimiento: fechaVencimiento});  
				await this.cuotasDAO.programarCuota({monto, tipo_socio_id: parseInt(to), abono_multiple: abonoMultiple, maxima_cantidad_abono_multiple: maxCantAbonoMult, club_asociado_id: club.id});
				await this.asignarCuotaASocios(cuota, club);
				await this.cronJobCuota(monto, to, club, fechaEmision, fechaVencimiento);
				return cuota;
			}else{
				await this.cuotasDAO.programarCuota({monto, tipo_socio_id: parseInt(to), club_asociado_id:club.id, fecha_emision: fechaEmision, fecha_vencimiento: fechaVencimiento});
				await this.cronJobCuota(monto, to, club, fechaEmision, fechaVencimiento);
			}
		} catch (err) {
			console.log(err.message);
		}
	}

	async cronJobCuota(monto, to, club, fechaEmision, fechaVencimiento){
		const job = cron.schedule('0 0 1 * *', async() => {
			try {
				const cuota = await this.cuotasDAO.createCuota({
					monto,
					tipo_socio_id: parseInt(to),
					club_asociado_id: club.id,
					fecha_emision: fechaEmision,
					fecha_vencimiento: fechaVencimiento
				});
				console.log(`cuota ${to} creada`);
				await this.asignarCuotaASocios(cuota, club);
				if(!this.jobsMap.has(to)){
					this.jobsMap.set(to, job);
				}
				//enviar notificacion al admin
				return job;
			} catch (error) {
				console.error('Error en el cron job:', error.message);
			}
		});
	}

	async getAllCuotas(clubAsociado){
		return await this.cuotasDAO.getAllCuotas(clubAsociado);
	}

	async getMisCuotasPendientes(socioId){
		return await this.cuotasDAO.getMisCuotasPendientes(socioId);
	}

	async getMisCuotasPagas(socioId){
		return await this.cuotasDAO.getMisCuotasPagas(socioId);
	}

	async getAllCuotasSocio(socioId){
		return await this.cuotasDAO.getAllCuotasSocio(socioId);
	}

	async pagarCuota(formaDePago, deuda, socioId, socioCuotaId, mesesAbonados, clubAsociado){
		const socioCuota = await this.cuotasDAO.getSocioCuota(socioCuotaId);
		const cuotaId = socioCuota.dataValues.cuota_id;
		const cuota = await this.getCuota(cuotaId);
		const monto = cuota.dataValues.monto;
		let socioIdString = socioId.toString().slice(-3);
		for (let i = 1; i < mesesAbonados; i++) {
			await this.cuotasDAO.createSocioCuota({
				id: parseInt(`${cuotaId}${i}${socioIdString}`), 
				forma_de_pago: formaDePago,
				estado: 'PAGO',
				fecha_pago:new Date(),
				socio_id:socioId,
				cuota_id: cuotaId
			});
		}
		return await this.cuotasDAO.pagarCuota(formaDePago, deuda, socioId, socioCuotaId, monto, mesesAbonados, clubAsociado);
	}

	async getSocioCuota(id){
		return await this.cuotasDAO.getSocioCuota(id);
	}

	async getCuota(id){
		return await this.cuotasDAO.getCuota(id);
	}

	async getCuotasProgramadas(club){
		return await this.cuotasDAO.getCuotasProgramadas(club);
	}

	async eliminarCuotaProgramada(to, club){
		//crear un timeout para mandar mail de 1 min en caso que el admin se arrepienta de la cuota
		const job = this.jobsMap.get(to);
		if(job){
			job.stop();
			this.jobsMap.delete(to);
		}
		return this.cuotasDAO.eliminarCuotaProgramada(club, to);
	}

	async actualizarValorDeCuota(club, to, monto){
		return await this.cuotasDAO.actualizarValorDeCuota(club, to, monto);
	}

	async getLast3CuotasPagas(socioId){
		return await this.cuotasDAO.getLast3CuotasPagas(socioId);
	}
	//FEATURE ENVIAR MAIL PERSONALIZADO
}

module.exports = CuotasApi;