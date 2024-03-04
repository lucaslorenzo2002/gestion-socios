import {CuotasDAO} from '../database/cuotas.js';
import {SociosApi} from '../services/socios.js';
import {createOrder, findOrder} from '../utils/createOrder.js';
import {CuotasApi} from './cuotas.js';

export class PagosApi{
	cuotasDAO: CuotasDAO;
	sociosApi: SociosApi;
	cuotasApi: CuotasApi;
	constructor(){
		this.cuotasDAO = new CuotasDAO();
		this.sociosApi = new SociosApi();
		this.cuotasApi = new CuotasApi();
	}

	async crearOrdenDePago(infoCuotas){
		return await createOrder(infoCuotas);
	}

	async reciveWebhook(dataId){
		return await findOrder(dataId);
	}
}
