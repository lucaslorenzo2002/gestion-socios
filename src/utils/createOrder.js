const mercadopago = require('mercadopago');
require('dotenv').config();

const createOrder = async(socioId, socioCuotaId, amount, socioDeuda) => {
	mercadopago.configure({
		access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN
	});

	return await mercadopago.preferences.create({
		items:[
			{
				title: 'CUOTA',
				unit_price: amount,
				currency_id: 'ARS',
				quantity: 1,
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
		notification_url: `${process.env.DEV_SSL_CERTIFICATE_URL}/api/webhook`
	});
};

const findOrder = async(dataId) => {
	return await mercadopago.payment.findById(dataId);
};

module.exports = {createOrder, findOrder};