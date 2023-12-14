const CuotasDAO = require('../database/cuotas');
const SociosApi = require('../services/socios');
const sendEmail = require('../utils/sendEmail');

class CuotasApi{
	constructor(){
		this.cuotasDAO = new CuotasDAO();
		this.sociosApi = new SociosApi();
	}

	async createCuota(monto, to, club){
		const fechaActualEmision = new Date();
		fechaActualEmision.setDate(2);
		const fechaISO = fechaActualEmision.toISOString();
		const fechaEmision = fechaISO.split('T')[0];

		const fechaActualVencimiento = new Date();
		fechaActualVencimiento.setMonth(fechaActualVencimiento.getMonth() + 1);
		fechaActualVencimiento.setDate(10);
		let dia = fechaActualVencimiento.getDate();
		let mes = fechaActualVencimiento.getMonth() + 1;
		let anio = fechaActualVencimiento.getFullYear();
		let fechaVencimiento = `${dia}/${mes}/${anio}`;

		const cuota = await this.cuotasDAO.createCuota({monto, to, club, fecha_emision: fechaEmision, fecha_vencimiento: fechaVencimiento});
		
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
			if(sociosTarget[i].dataValues.estado_socio === 'ACTIVO' && sociosTarget[i].dataValues.club_asociado === club){
				await this.sociosApi.updateSocioDeuda(sociosTarget[i].dataValues.deuda + cuota.dataValues.monto, sociosIds[i], club);		
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
		const cuotaId = socioCuota.dataValues.cuota_id;
		const cuota = await this.getCuota(cuotaId);
		const monto = cuota.dataValues.monto;
		console.log(formaDePago, deuda, socioId, socioCuotaId);
		return await this.cuotasDAO.pagarCuota(formaDePago, deuda, socioId, socioCuotaId, monto);
	}

	async getSocioCuota(id){
		return await this.cuotasDAO.getSocioCuota(id);
	}

	async getCuota(id){
		return await this.cuotasDAO.getCuota(id);
	}
}

module.exports = CuotasApi;