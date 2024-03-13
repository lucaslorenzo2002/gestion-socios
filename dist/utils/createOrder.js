import mercadopago from 'mercadopago';
export const createOrder = async (infoCuotas) => {
    mercadopago.configure({
        access_token: 'TEST-3865151540386071-120307-1f85192c46613971d7c6c18f8a1171a5-1574396113' /* ,
        client_id: '13201542688200',
        client_secret: '3qeYIJemwaEi2ISrCKQTY6tn815IFElQ' */
    });
    let preference = {
        items: [],
        back_urls: {
            success: 'http://localhost:4000/api/success',
            failure: 'http://localhost:4000/api/failure',
            pending: 'http://localhost:4000/api/pending'
        },
        payment_methods: {
            installments: 1
        },
        notification_url: 'https://59ea-2800-810-456-942a-5dab-2c8-ba20-ae7e.ngrok-free.app/api/webhook'
    };
    for (let i = 0; i < infoCuotas.length; i++) {
        preference['items'].push({
            title: 'CUOTA',
            id: infoCuotas[i].id.toString(),
            unit_price: infoCuotas[i].monto,
            category_id: infoCuotas[i].tipoDeCuota,
            currency_id: 'ARS',
            quantity: infoCuotas[i].cantidad,
        });
    }
    return await mercadopago.preferences.create(preference);
};
export const findOrder = async (dataId) => {
    return await mercadopago.payment.findById(dataId);
};
//# sourceMappingURL=createOrder.js.map