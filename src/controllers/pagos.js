const asyncHandler = require('express-async-handler');
const PagosApi = require('../services/pagos');
const CuotasApi = require('../services/cuotas');
const paymentMethods = require('../utils/paymentMethods');
require('dotenv').config();

class PagosController{
	constructor(){
		this.pagosApi = new PagosApi();
		this.cuotasApi = new CuotasApi();
		this.aditionalPaymentInformation = new Map();
	}

	crearOrden = asyncHandler(async(req, res) => {
		try {
			const {id, club_asociado_id, deuda} = req.user;
			const mercadoPagoResponse = await this.pagosApi.crearOrdenDePago(req.body);
			this.aditionalPaymentInformation.set('clubAsociado', club_asociado_id);
			this.aditionalPaymentInformation.set('socioDeuda', deuda);
			this.aditionalPaymentInformation.set('socioId', id);
			
			res.status(201).json({success: true, message: 'orden creada con exito', url: mercadoPagoResponse.body.init_point});
		} catch (err) {
			console.log(err.message);
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	reciveWebhook = asyncHandler(async(req, res) => {
		try {
			if(req.query.type === 'payment'){
				const order = await this.pagosApi.reciveWebhook(req.query['data.id']);	
				await this.cuotasApi.pagarCuota(
					paymentMethods(order.body.payment_method_id, order.body.payment_type_id), 
					this.aditionalPaymentInformation.get('socioDeuda'), 
					this.aditionalPaymentInformation.get('socioId') ,
					order.body.additional_info.items, 
					this.aditionalPaymentInformation.get('clubAsociado'),
				); 
			} 
			res.status(201).json({success: true, message: 'webhook'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err});
		}
	});	   

}

module.exports = PagosController;