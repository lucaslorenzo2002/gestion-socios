const CuotasDAO = require('../database/cuotas');
const NotificacionesApi = require('../services/notificaciones');
const SociosApi = require('../services/socios');
const sendEmail = require('../utils/sendEmail');

class CuotasApi{
	constructor(){
		this.cuotasDAO = new CuotasDAO();
		this.sociosApi = new SociosApi();
		this.notificacionesApi = new NotificacionesApi();
	}

	async createCuota(monto, to, club){
		//crear notificacion avisandole que debe pagar cuota
		const fechaActual = new Date();
		fechaActual.setMonth(fechaActual.getMonth() + 1);
		const fechaDeVencimiento = fechaActual.toISOString().split('T')[0];

		const cuota = await this.cuotasDAO.createCuota({monto, to, club, fecha_vencimiento: fechaDeVencimiento});
		
		const sociosTarget = await this.sociosApi.filterSociosByTipo(cuota.dataValues.to);	
		const sociosIds = sociosTarget.map(socio => socio.dataValues.id);

		//Mail
		let message = `
        <h2>PORFAVOR NO RESPONDER ESTE MENSAJE</h2>
        <p>Estimado socio, se envia este mail para hacerle saber que tiene una nueva cuota.</p>
        <p>Para pagar la misma debera ingresar a la aplicacion.</p> 
        <p>Muchas gracias</p> 
        <p>Administracion club ${club}</p> `
		;
		let from = process.env.EMAIL_USER;
		let subject = `${club}, AVISO DE NUEVA CUOTA`;
			
		for (let i = 0; i < sociosIds.length; i++) {		
			if(sociosTarget[i].dataValues.estado_socio === 'ACTIVO'){
				await this.notificacionesApi.createNotificacion('NUEVA CUOTA', 'tenes nuevas cuotas pendientes', sociosTarget[i].dataValues.id);
				await this.sociosApi.updateSocioDeuda(sociosTarget[i].dataValues.deuda + cuota.dataValues.monto, sociosIds[i]);		
				let emailTo = sociosTarget[i].dataValues.email;
				await sendEmail(from, emailTo, subject, message);
				this.cuotasDAO.createSocioCuota(`${cuota.dataValues.id}${sociosIds[i]}`, cuota.dataValues.id, sociosIds[i]);
			}
		}  

		return cuota;
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

	async pagarCuota(formaDePago, deuda, socioId, socioCuotaId){
		const socioCuota = await this.cuotasDAO.getSocioCuota(socioCuotaId);
		console.log(socioCuota);
		const cuotaId = socioCuota.dataValues.cuota_id;
		const cuota = await this.getCuota(cuotaId);
		const monto = cuota.dataValues.monto;
		return await this.cuotasDAO.pagarCuota(formaDePago, deuda, socioId, socioCuotaId, monto);
	}

	async getCuota(id){
		return await this.cuotasDAO.getCuota(id);
	}

	async cuotas(){

	}
    
}

module.exports = CuotasApi;