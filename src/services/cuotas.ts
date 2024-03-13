import {CuotasDAO} from '../database/cuotas.js';
import {SociosApi} from '../services/socios.js';
import sendEmail from '../utils/sendEmail.js';
import {CategoriasSocioApi} from './categoriasSocio.js';
import moment from 'moment';
import cron from 'node-cron';
import logger from '../utils/logger.js';
import { ActividadesApi } from './actividades.js';
import { BadRequestError } from '../errors/bad-request-error.js';

export class CuotasApi{
	sociosApi: SociosApi;
	cuotasDAO: CuotasDAO;
	categoriasSocioApi: CategoriasSocioApi;
	actividadesApi: ActividadesApi;
	jobsMap: Map<any, any>;
	constructor(){
		this.cuotasDAO = new CuotasDAO();
		this.sociosApi = new SociosApi();
		this.categoriasSocioApi = new CategoriasSocioApi();
		this.actividadesApi = new ActividadesApi();
		this.jobsMap = new Map();
	}

	//Cron job
	async asignarCuotaASocios(cuotaId, club){
		try {
			const cuota:any = await this.cuotasDAO.findCuotaById(cuotaId.dataValues.id);

			let message = `
        	<h2>PORFAVOR NO RESPONDER ESTE MENSAJE</h2>
        	<p>Estimado socio, se envia este mail para hacerle saber que tiene una nueva cuota.</p>
        	<p>Para pagar la misma debera ingresar a la aplicacion.</p> 
        	<p>Muchas gracias</p> 
        	<p>Administracion club ${club.nombre}</p> `
			;
			let from = process.env.EMAIL_USER;
			let subject = `${club.nombre}, AVISO DE NUEVA CUOTA`;
			let sociosTarget: any;

			if(cuota.dataValues.tipo_socio_id){
				sociosTarget = await this.sociosApi.filterSociosCuotaByTipoSocio(cuota.dataValues.tipo_socio_id, club.id);	
				
				for (let i = 0; i < sociosTarget.length; i++) {		
					if(sociosTarget[i].dataValues.estado_socio === 'ACTIVO')
						if(sociosTarget[i].dataValues.meses_abonados_cuota_social === 0){
	
						await this.sociosApi.updateSocioDeuda(sociosTarget[i].dataValues.deuda + cuota.dataValues.monto, sociosTarget[i].dataValues.id, club.id);		
						let emailTo = sociosTarget[i].dataValues.email;
						if(emailTo) await sendEmail(from, emailTo, subject, message);				
						let socioIdString = sociosTarget[i].dataValues.id.toString().slice(-4);
						this.cuotasDAO.createSocioCuota({id: parseInt(`${cuota.dataValues.id}${socioIdString}`), cuota_id: cuota.dataValues.id, socio_id: sociosTarget[i].dataValues.id});
					}else{
						await this.sociosApi.updateSocioMesesAbonadosCuotaSocial(sociosTarget[i].dataValues.meses_abonados_cuota_social-1, club.id, sociosTarget[i].dataValues.id)
					}
				}
			}else{
				const socios:any = await this.sociosApi.filterSociosCuotaByActividad(cuota.dataValues.actividad_id, cuota.dataValues.categoria_id, club.id);
				sociosTarget = socios.map((socio) => socio.dataValues.Socio);
				let actividadSocio;

				for (let i = 0; i < sociosTarget.length; i++) {		
					if(sociosTarget[i].dataValues.estado_socio === 'ACTIVO')
						actividadSocio = await this.actividadesApi.getActividadSocio(sociosTarget[i].dataValues.id, cuota.dataValues.actividad_id, club.id);
						if(actividadSocio.dataValues.meses_abonados_cuota_deporte === 0){
	
						await this.sociosApi.updateSocioDeuda(sociosTarget[i].dataValues.deuda + cuota.dataValues.monto, sociosTarget[i].dataValues.id, club.id);		
						let emailTo = sociosTarget[i].dataValues.email;
						if(emailTo) await sendEmail(from, emailTo, subject, message);				
						let socioIdString = sociosTarget[i].dataValues.id.toString().slice(-4);
						console.log(parseInt(`${cuota.dataValues.id}${socioIdString}`))
						this.cuotasDAO.createSocioCuota({id: parseInt(`${cuota.dataValues.id}${socioIdString}`), cuota_id: cuota.dataValues.id, socio_id: sociosTarget[i].dataValues.id});
					}else{
						await this.actividadesApi.updateSocioMesesAbonadosCuotaDeportiva(actividadSocio.dataValues.meses_abonados_cuota_deporte-1, sociosTarget[i].dataValues.id, cuota.dataValues.actividad_id, club.id);
					}
				}				
			}
		} catch (err) {
			console.log(err.message);
		}
	}

	async programarCuota(
		tipoDeCuota: string, 
		fechaEmision: Date, 
		monto: number, 
		to: number,
		actividadId: number,
		categoriasId: number[],
		abonoMultiple: boolean, 
		maxCantAbonoMult: number, 
		club
		){
		try {
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

			if(actividadId !== 1 && categoriasId.length > 1){
				let cuota;
				for (const categoriaId of categoriasId) {
					const cuotaYaExistente = await this.cuotasDAO.findCuotaProgrmada(null, actividadId, categoriaId, club.id);
					if(cuotaYaExistente) throw new BadRequestError('La cuota que intenta crear ya esta programada');

					if(fechaEmisionMoment.isSameOrBefore(moment())){
						const cuotaProgramada = await this.cuotasDAO.programarCuota({tipo_de_cuota: tipoDeCuota, monto, actividad_id: actividadId, categoria_id: categoriaId, abono_multiple: abonoMultiple, maxima_cantidad_abono_multiple: maxCantAbonoMult, club_asociado_id: club.id});
						cuota = await this.cuotasDAO.createCuota({
							monto, 
							cuota_programada_id: cuotaProgramada.dataValues.id, 
							tipo_de_cuota: tipoDeCuota, 
							categoria_id: categoriaId,
							actividad_id: actividadId,
							fecha_emision: fechaEmision, 
							fecha_vencimiento: fechaVencimiento, 
							club_asociado_id: club.id
						});  
						await this.asignarCuotaASocios(cuota, club);
						await this.cronJobCuota(monto, cuotaProgramada.dataValues.id, new Date(), fechaVencimiento);
					}else{
						const cuotaProgramada = await this.cuotasDAO.programarCuota({tipo_de_cuota: tipoDeCuota, monto, actividad_id: actividadId, categoria_id: categoriaId, abono_multiple: abonoMultiple, maxima_cantidad_abono_multiple: maxCantAbonoMult, club_asociado_id: club.id});
						await this.cronJobCuota(monto, cuotaProgramada.dataValues.id, new Date(), fechaVencimiento);
					}
				}
				return cuota.dataValues.id;
			}else{
				const cuotaYaExistente = await this.cuotasDAO.findCuotaProgrmada(to, actividadId, categoriasId[0] || null, club.id);
				if(cuotaYaExistente) throw new BadRequestError('La cuota que intenta crear ya esta programada');
				if(actividadId === 1){
					actividadId = undefined
				}

				if(fechaEmisionMoment.isSameOrBefore(moment())){
					const cuotaProgramada = await this.cuotasDAO.programarCuota({tipo_de_cuota: tipoDeCuota, monto, tipo_socio_id: to, actividad_id: actividadId, categoria_id: categoriasId[0] || null, abono_multiple: abonoMultiple, maxima_cantidad_abono_multiple: maxCantAbonoMult, club_asociado_id: club.id});
					const cuota = await this.cuotasDAO.createCuota({
						monto, 
						cuota_programada_id: cuotaProgramada.dataValues.id, 
						fecha_emision: fechaEmision, 
						tipo_de_cuota: cuotaProgramada.dataValues.tipo_de_cuota,
						tipo_socio_id: to, 
						actividad_id: actividadId, 
						categoria_id: categoriasId[0],
						fecha_vencimiento: fechaVencimiento, 
						club_asociado_id: club.id
					});  
					await this.asignarCuotaASocios(cuota, club);
					await this.cronJobCuota(monto, cuotaProgramada.dataValues.id, fechaEmision, fechaVencimiento);
					return cuota.dataValues.id;
				}else{
					const cuotaProgramada = await this.cuotasDAO.programarCuota({tipo_de_cuota: tipoDeCuota, monto, tipo_socio_id: to, actividad_id: actividadId, categoria_id: categoriasId[0] || null, abono_multiple: abonoMultiple, maxima_cantidad_abono_multiple: maxCantAbonoMult, club_asociado_id: club.id});
					await this.cronJobCuota(monto, cuotaProgramada.dataValues.id, fechaEmision, fechaVencimiento);
				}
			}
		} catch (err) {
			console.log(err.message);
		}
	}

	async cronJobCuota(monto, cuotaProgramadaId, fechaEmision, fechaVencimiento){
		const job = cron.schedule('0 0 1 * *' , async() => {
			try {
				const cuotaProgramada: any = await this.cuotasDAO.findCuotaProgramadaById(cuotaProgramadaId);

				const cuota:any = await this.cuotasDAO.createCuota({
					monto,
					cuota_programada_id: cuotaProgramadaId,
					tipo_socio_id: cuotaProgramada.dataValues.to, 
					actividad_id: cuotaProgramada.dataValues.actividad_id, 
					categoria_id: cuotaProgramada.dataValues.categoria_id,
					fecha_emision: fechaEmision,
					fecha_vencimiento: fechaVencimiento,
					club_asociado_id: cuotaProgramada.dataValues.club_asociado.dataValues.id
				});

				await this.asignarCuotaASocios(cuota, cuotaProgramada.dataValues.club_asociado.dataValues);
				logger.info(`cuota ${cuotaProgramada.dataValues.actividad_id} creada`);
				
				if(cuotaProgramada.dataValues.categoria_id){
					if(!this.jobsMap.has(cuotaProgramada.dataValues.categoria_id)){
						this.jobsMap.set(cuotaProgramada.dataValues.categoria_id, job);
					} 
				}else if(cuotaProgramada.dataValues.tipo_socio_id){
					if(!this.jobsMap.has(cuotaProgramada.dataValues.tipo_socio_id)){
						this.jobsMap.set(cuotaProgramada.dataValues.tipo_socio_id, job);
					} 
				}else{
					if(!this.jobsMap.has(cuotaProgramada.dataValues.actividad_id)){
						this.jobsMap.set(cuotaProgramada.dataValues.actividad_id, job);
					} 
				}
				
				//enviar notificacion al admin
				return job;
			} catch (error) {
				console.error('Error en el cron job:', error.message);
			}
		});
	}

	async getAllCuotas(clubAsociado: number){
		return await this.cuotasDAO.getAllCuotas(clubAsociado);
	}

	async totalCuotasPendientes(socioId){
		return await this.cuotasDAO.totalCuotasPendientes(socioId)
	}

	async getMisCuotasPendientes(socioId: number){
		return await this.cuotasDAO.getMisCuotasPendientes(socioId);
	}

	async getMisCuotasPagas(socioId: number){
		return await this.cuotasDAO.getMisCuotasPagas(socioId);
	}

	async getAllCuotasSocio(socioId: number){
		return await this.cuotasDAO.getAllCuotasSocio(socioId);
	}

	//mandar al servicio de pagos
	async pagarCuota(
		formaDePago: string, 
		deuda: number, 
		socioId: number, 
		socioCuotaId, 
		clubAsociado: number,
		tipoDeCuota: string,
		mesesAbonados: number 
		){
		
		let socioCuota = await this.cuotasDAO.getSocioCuota(socioCuotaId);
		const cuotaId = socioCuota.dataValues.cuota_id;
		const cuota = await this.getCuota(cuotaId);
		const monto = cuota.dataValues.monto;
		await this.sociosApi.updateSocioDeuda(deuda-monto, socioId, clubAsociado);
		await this.cuotasDAO.pagarCuota(formaDePago, socioId, socioCuotaId, clubAsociado);	

		
		if(mesesAbonados > 1){
			let socioIdString = String(socioId).slice(-4);
			for (let i = 0; i < mesesAbonados-1; i++) {
				await this.cuotasDAO.createSocioCuota({
					id: parseInt(`${cuotaId}${i}${socioIdString}`), 
					forma_de_pago: formaDePago,
					estado: 'PAGO',
					fecha_pago:new Date(),
					socio_id:socioId,
					cuota_id: cuotaId
				});
			} 

			if(tipoDeCuota === 'cuota social'){
				await this.sociosApi.updateSocioMesesAbonadosCuotaSocial(mesesAbonados-1, clubAsociado, socioId);
			}else{
				const cuota = await this.cuotasDAO.findCuotaById(cuotaId);
				const actividadId = cuota.dataValues.actividad_id;

				await this.actividadesApi.updateSocioMesesAbonadosCuotaDeportiva(mesesAbonados-1, socioId, actividadId, clubAsociado);
			}
		}
	}

	async getSocioCuota(id: number){
		return await this.cuotasDAO.getSocioCuota(id);
	}

	async getCuota(id: number){
		return await this.cuotasDAO.getCuota(id);
	}

	async getCuotasProgramadas(club: number){
		return await this.cuotasDAO.getCuotasProgramadas(club);
	}

	async eliminarCuotaProgramada(tipoDeSocioId: number, actividadId:number, categoriaId: number, club: number){
		
		if(tipoDeSocioId){
			const job = this.jobsMap.get(tipoDeSocioId);
			
			if(job){
				job.stop();
				this.jobsMap.delete(tipoDeSocioId);
			
			}
			return this.cuotasDAO.eliminarCuotaProgramada(club, tipoDeSocioId, actividadId, categoriaId);
		}else if(categoriaId){
			const job = this.jobsMap.get(categoriaId);
			
			if(job){
				job.stop();
				this.jobsMap.delete(categoriaId);
			}
			
			return this.cuotasDAO.eliminarCuotaProgramada(club, tipoDeSocioId, actividadId, categoriaId);
		}else{
			const job = this.jobsMap.get(actividadId);
			
			if(job){
				job.stop();
				this.jobsMap.delete(actividadId);
			}
			
			return this.cuotasDAO.eliminarCuotaProgramada(club, tipoDeSocioId, actividadId, categoriaId);
		}
	}

	async actualizarValorDeCuota(club: number, tipoSocioId: number, actividadId: number, categoriaId: number, monto: number){
		return await this.cuotasDAO.actualizarValorDeCuota(club, tipoSocioId, actividadId, categoriaId, monto);
	}

	async getLast3CuotasPagas(socioId: number){
		return await this.cuotasDAO.getLast3CuotasPagas(socioId);
	}
	//FEATURE ENVIAR MAIL PERSONALIZADO
}
