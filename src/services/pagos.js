const CuotasDAO = require('../database/cuotas');
const SociosApi = require('../services/socios');
const createOrder = require('../utils/createOrder');
const CuotasApi = require('./cuotas');

class PagosApi{
	constructor(){
		this.cuotasDAO = new CuotasDAO();
		this.sociosApi = new SociosApi();
		this.cuotasApi = new CuotasApi();
	}

	async crearOrdenDePago(socioId, socioCuotaId, socioDeuda, cantCuotas){
		
		const socioCuota = await this.cuotasDAO.getSocioCuota(socioCuotaId);
		const cuotaId = socioCuota.dataValues.cuota_id;
		const cuota = await this.cuotasApi.getCuota(cuotaId);
		const monto = cuota.dataValues.monto;
		return await createOrder.createOrder(socioId, socioCuotaId, monto, socioDeuda, cantCuotas);
	}

	async reciveWebhook(dataId){
		return await createOrder.findOrder(dataId);
	}
}

module.exports = PagosApi;