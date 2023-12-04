const mercadopago = require('mercadopago');
require('dotenv').config();

const createOrder = async(amount) => {
	mercadopago.configure({
		access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN
	});

	const result = await mercadopago.preferences.create({
		items:[
			{
				title: 'CUOTA',
				unit_price: amount,
				currency_id: 'ARS',
				quantity: 1
			}
		]
	});
	console.log(result);
};

module.exports = createOrder;