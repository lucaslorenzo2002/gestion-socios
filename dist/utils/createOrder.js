import { MercadoPagoConfig, PreApproval, Preference, Payment, CustomerCard, Customer } from 'mercadopago';
import { BadRequestError } from '../errors/bad-request-error.js';
export const createOrder = async (infoCuotas) => {
    const client = new MercadoPagoConfig({
        accessToken: 'TEST-3865151540386071-120307-1f85192c46613971d7c6c18f8a1171a5-1574396113'
    });
    let body = {
        items: [],
        back_urls: {
            success: 'http://localhost:5173/pagoexitoso',
            failure: 'http://localhost:4000/api/failure',
            pending: 'http://localhost:4000/api/pending'
        },
        payment_methods: {
            installments: 1
        },
        notification_url: 'https://7072-2800-810-456-80c5-501b-4d6b-14b4-72b0.ngrok-free.app/api/webhook'
    };
    for (let i = 0; i < infoCuotas.length; i++) {
        body['items'].push({
            title: 'CUOTA',
            id: infoCuotas[i].id.toString(),
            unit_price: infoCuotas[i].monto,
            category_id: infoCuotas[i].tipoDeCuota,
            currency_id: 'ARS',
            quantity: infoCuotas[i].cantidad,
        });
    }
    const preference = new Preference(client);
    return await preference.create({ body });
};
export const findOrder = async (dataId) => {
    const client = new MercadoPagoConfig({
        accessToken: 'TEST-3865151540386071-120307-1f85192c46613971d7c6c18f8a1171a5-1574396113'
    });
    const payment = new Payment(client);
    return payment.get({ id: dataId });
};
export const createSubscription = async (socioEmail, startDate, transactionAmount) => {
    const client = new MercadoPagoConfig({
        accessToken: 'TEST-3865151540386071-120307-1f85192c46613971d7c6c18f8a1171a5-1574396113'
    });
    /*
    '200765683457941',
    '1eGqFC3yMnQ81tTUJCTqKZ8oDtYJFb2l'
    */
    let body = {
        back_url: "https://google.com.ar",
        reason: "Pago de cuotas mensuales",
        auto_recurring: {
            frequency: 1,
            frequency_type: "months",
            currency_id: "ARS",
            transaction_amount: 15
        },
        payer_email: "laura.v.rodriguez@gmail.com",
        status: 'authorized',
        card_token_id: "9b2d63e00d66a8c721607214ceda233a"
    };
    const preapproval = new PreApproval(client);
    return preapproval.create({ body });
};
export const createClient = async (socioEmail) => {
    const client = new MercadoPagoConfig({
        accessToken: 'TEST-3865151540386071-120307-1f85192c46613971d7c6c18f8a1171a5-1574396113'
    });
    const customer = new Customer(client);
    const body = {
        email: socioEmail
    };
    customer.create({ body }).then((result) => {
        const customerCard = new CustomerCard(client);
        const body = {
            token: result.cards[0].body.token,
        };
        return customerCard.create({ customerId: result.id, body });
    }).catch((err) => {
        throw new BadRequestError(err.cause[0].description);
    });
};
// el socio solicita adherirse al debito automatico
// pone info de medio de pago
// acepta terminos y condiciones
// se tiene que quedar guardado en memoria el mail del socio
// el admin aprueba el adherimiento al debito automatico
// se crea una subscripcion donde el monto va a ser el total a pagar de todas las cuotas de dicho mes
//# sourceMappingURL=createOrder.js.map