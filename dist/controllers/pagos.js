import asyncHandler from 'express-async-handler';
import { PagosApi } from '../services/pagos.js';
import { CuotasApi } from '../services/cuotas.js';
import { paymentMethods } from '../utils/paymentMethods.js';
export class PagosController {
    constructor() {
        this.crearOrden = asyncHandler(async (req, res) => {
            try {
                const { id, club_asociado_id, deuda } = req.user;
                const mercadoPagoResponse = await this.pagosApi.crearOrdenDePago(req.body);
                this.aditionalPaymentInformation.set('clubAsociado', club_asociado_id);
                this.aditionalPaymentInformation.set('socioDeuda', deuda);
                this.aditionalPaymentInformation.set('socioId', id);
                this.aditionalPaymentInformation.set('cuotasAPagar', req.body.length);
                res.status(201).json({ success: true, message: 'orden creada con exito', url: mercadoPagoResponse.body.init_point });
            }
            catch (err) {
                console.log(err.message);
                res.status(500).json({ success: false, message: 'hubo un error ' + err.message });
            }
        });
        this.reciveWebhook = asyncHandler(async (req, res) => {
            try {
                const cantCuotasAPagar = this.aditionalPaymentInformation.get('cuotasAPagar');
                if (req.query.type === 'payment') {
                    const order = await this.pagosApi.reciveWebhook(req.query['data.id']);
                    console.log(order.body.payment_method_id, order.body.payment_type_id);
                    for (let i = 0; i < cantCuotasAPagar; i++) {
                        await this.cuotasApi.pagarCuota(paymentMethods(order.body.payment_method_id, order.body.payment_type_id), this.aditionalPaymentInformation.get('socioDeuda'), this.aditionalPaymentInformation.get('socioId'), order.body.additional_info.items[i].id, this.aditionalPaymentInformation.get('clubAsociado'), order.body.additional_info.items[i].category_id, order.body.additional_info.items[i].quantity);
                    }
                }
                res.status(201).json({ success: true, message: 'webhook' });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'hubo un error ' + err });
            }
        });
        this.pagosApi = new PagosApi();
        this.cuotasApi = new CuotasApi();
        this.aditionalPaymentInformation = new Map();
    }
}
//# sourceMappingURL=pagos.js.map