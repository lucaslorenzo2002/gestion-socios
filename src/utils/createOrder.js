const mercadopago = require('mercadopago');
require('dotenv').config();

const createOrder = async(socioId, socioCuotaId, amount, socioDeuda, cantCuotas) => {
	mercadopago.configure({
		access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN/* ,
		client_id: process.env.MERCADO_PAGO_CLIENT_ID,
		client_secret: process.env.MERCADO_PAGO_CLIENT_SECRET */
	});

	return await mercadopago.preferences.create({
		items:[
			{
				title: 'CUOTA',
				unit_price: amount,
				currency_id: 'ARS',
				quantity: cantCuotas,
				description: socioCuotaId,
				category_id: socioId,
				id: socioDeuda
			}
		],
		back_urls:{
			success: 'http://localhost:4000/api/success',
			failure: 'http://localhost:4000/api/failure',
			pending: 'http://localhost:4000/api/pending'
		},
		payment_methods:{
			installments: 1
		}, 
		notification_url: 'https://97c2-2800-810-456-942a-9409-b687-6e68-7dcf.ngrok-free.app/api/webhook'
	});
};

const findOrder = async(dataId) => {
	return await mercadopago.payment.findById(dataId);
};

module.exports = {createOrder, findOrder};