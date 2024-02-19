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

	async crearOrdenDePago(infoCuotas){
		return await createOrder.createOrder(infoCuotas);
	}

	async reciveWebhook(dataId){
		return await createOrder.findOrder(dataId);
	}
}

module.exports = PagosApi;