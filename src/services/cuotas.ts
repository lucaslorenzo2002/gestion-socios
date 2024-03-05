import {CuotasDAO} from '../database/cuotas.js';
import {SociosApi} from '../services/socios.js';
import sendEmail from '../utils/sendEmail.js';
import {CategoriasSocioApi} from './categoriasSocio.js';
import moment from 'moment';
import cron from 'node-cron';
import logger from '../utils/logger.js';

export class CuotasApi{
	sociosApi: SociosApi;
	cuotasDAO: CuotasDAO;
	categoriasSocioApi: CategoriasSocioApi;
	jobsMap: Map<any, any>;
	constructor(){
		this.cuotasDAO = new CuotasDAO();
		this.sociosApi = new SociosApi();
		this.categoriasSocioApi = new CategoriasSocioApi();
		this.jobsMap = new Map();
	}

	//Cron job
	async asignarCuotaASocios(cuotaId, club){
		try {
			const cuota:any = await this.cuotasDAO.findCuotaById(cuotaId.dataValues.id);
			const cuotaProgramada = cuota?.get('CuotaProgramada')?.get();

			let sociosTarget: any;

			if(cuotaProgramada.tipo_socio_id){
				sociosTarget = await this.sociosApi.filterSociosCuotaByTipoSocio(cuotaProgramada.tipo_socio_id, club.id);
			}else{
				const socios:any = await this.sociosApi.filterSociosCuotaByActividad(cuotaProgramada.actividad_id, cuotaProgramada.categoria_id, club.id);
				sociosTarget = socios.map((socio) => socio.dataValues.Socio)
			}

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

			//no enviar cuota a los que tienen meses abonados
			for (let i = 0; i < sociosTarget.length; i++) {		
				if(sociosTarget[i].dataValues.estado_socio === 'ACTIVO'){
					console.log(sociosTarget[i])
					await this.sociosApi.updateSocioDeuda(sociosTarget[i].dataValues.deuda + cuota.dataValues.monto, sociosTarget[i].dataValues.id, club.id);		
					let emailTo = sociosTarget[i].dataValues.email;
					if(emailTo) await sendEmail(from, emailTo, subject, message);				
					let socioIdString = sociosTarget[i].dataValues.id.toString().slice(-4);
					this.cuotasDAO.createSocioCuota({id: parseInt(`${cuota.dataValues.id}${socioIdString}`), cuota_id: cuota.dataValues.id, socio_id: sociosTarget[i].dataValues.id});
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
			console.log(actividadId, categoriasId.length)
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
					if(cuotaYaExistente) throw new Error('La cuota que intenta crear ya esta programada');

					if(fechaEmisionMoment.isSameOrBefore(moment())){
						const cuotaProgramada = await this.cuotasDAO.programarCuota({tipo_de_cuota: tipoDeCuota, monto, actividad_id: actividadId, categoria_id: categoriaId, abono_multiple: abonoMultiple, maxima_cantidad_abono_multiple: maxCantAbonoMult, club_asociado_id: club.id});
						cuota = await this.cuotasDAO.createCuota({monto, cuota_programada_id: cuotaProgramada.dataValues.id, fecha_emision: fechaEmision, fecha_vencimiento: fechaVencimiento, club_asociado_id: club.id});  
						await this.asignarCuotaASocios(cuota, club);
						await this.cronJobCuota(monto, cuotaProgramada.dataValues.id, fechaEmision, fechaVencimiento);
					}else{
						const cuotaProgramada = await this.cuotasDAO.programarCuota({tipo_de_cuota: tipoDeCuota, monto, actividad_id: actividadId, categoria_id: categoriaId, abono_multiple: abonoMultiple, maxima_cantidad_abono_multiple: maxCantAbonoMult, club_asociado_id: club.id});
						await this.cronJobCuota(monto, cuotaProgramada.dataValues.id, fechaEmision, fechaVencimiento);
					}
				}
				return cuota.dataValues.id;
			}else{
				const cuotaYaExistente = await this.cuotasDAO.findCuotaProgrmada(to, actividadId, categoriasId[0] || null, club.id);
				if(cuotaYaExistente) throw new Error('La cuota que intenta crear ya esta programada');
				if(actividadId === 1){
					actividadId = undefined
				}

				if(fechaEmisionMoment.isSameOrBefore(moment())){
					const cuotaProgramada = await this.cuotasDAO.programarCuota({tipo_de_cuota: tipoDeCuota, monto, tipo_socio_id: to, actividad_id: actividadId, categoria_id: categoriasId[0] || null, abono_multiple: abonoMultiple, maxima_cantidad_abono_multiple: maxCantAbonoMult, club_asociado_id: club.id});
					const cuota = await this.cuotasDAO.createCuota({monto, cuota_programada_id: cuotaProgramada.dataValues.id, fecha_emision: fechaEmision, fecha_vencimiento: fechaVencimiento, club_asociado_id: club.id});  
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

	async cronJobCuota(monto, cuotaProgrmadaId, fechaEmision, fechaVencimiento){
		const job = cron.schedule('0 0 1 * *', async() => {
			try {
				const cuota:any = await this.cuotasDAO.createCuota({
					monto,
					cuota_programada_id: cuotaProgrmadaId,
					fecha_emision: fechaEmision,
					fecha_vencimiento: fechaVencimiento
				});

				const cuotaProgramada = cuota?.get('CuotaProgramada')?.get();
				const valoresCuotaProgramada = cuotaProgramada?.dataValues;

				logger.info(`cuota ${valoresCuotaProgramada.tipo_socio_id || valoresCuotaProgramada.actividad_id} creada`);
				await this.asignarCuotaASocios(cuota.dataValues.id, valoresCuotaProgramada.Club.dataValues);
				
				if(valoresCuotaProgramada.categoria_id){
					if(!this.jobsMap.has(valoresCuotaProgramada.categoria_id)){
						this.jobsMap.set(valoresCuotaProgramada.categoria_id, job);
					} 
				}else if(valoresCuotaProgramada.tipo_socio_id){
					if(!this.jobsMap.has(valoresCuotaProgramada.tipo_socio_id)){
						this.jobsMap.set(valoresCuotaProgramada.tipo_socio_id, job);
					} 
				}else{
					if(!this.jobsMap.has(valoresCuotaProgramada.actividad_id)){
						this.jobsMap.set(valoresCuotaProgramada.actividad_id, job);
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
		/* tipoDeCuota: string,
		mesesAbonados: number */
		){
		
		let socioCuota = await this.cuotasDAO.getSocioCuota(socioCuotaId);
		const cuotaId = socioCuota.dataValues.cuota_id;
		const cuota = await this.getCuota(cuotaId);
		const monto = cuota.dataValues.monto;
		await this.sociosApi.updateSocioDeuda(deuda-monto, socioId, clubAsociado);
		await this.cuotasDAO.pagarCuota(formaDePago, socioId, socioCuotaId, clubAsociado);	

		/* for (let i = 0; i < mesesAbonados; i++) {
			
		} */
		
		

		//ver como hacer para pagar multiples meses la actividad o cuota social
		//let socioIdString = socioId.toString().slice(-3);
		/* for (let i = 1; i < mesesAbonados; i++) {
			await this.cuotasDAO.createSocioCuota({
				id: parseInt(`${cuotaId}${i}${socioIdString}`), 
				forma_de_pago: formaDePago,
				estado: 'PAGO',
				fecha_pago:new Date(),
				socio_id:socioId,
				cuota_id: cuotaId
			});
		} 
	 */}

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
