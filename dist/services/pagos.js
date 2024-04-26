import { CuotasDAO } from '../database/cuotas.js';
import { BadRequestError } from '../errors/bad-request-error.js';
import { SociosApi } from '../services/socios.js';
import { createClient, createOrder, createSubscription, findOrder } from '../utils/createOrder.js';
import { CuotasApi } from './cuotas.js';
export class PagosApi {
    constructor() {
        this.cuotasDAO = new CuotasDAO();
        this.sociosApi = new SociosApi();
        this.cuotasApi = new CuotasApi();
    }
    async crearOrdenDePago(infoCuotas, socioId, clubAsociadoId) {
        if (infoCuotas.length > 1 || infoCuotas[0].tipoDeCuota !== 'cuota inscripcion') {
            const socioCuotas = await this.cuotasApi.getMisCuotasPendientes(socioId, clubAsociadoId);
            const debeCuotaInscripcion = socioCuotas.find(cuota => cuota.tipo_de_cuota === 'cuota inscripcion');
            if (debeCuotaInscripcion) {
                const cuotaMensual = infoCuotas.find(infoCuota => infoCuota.tipoDeCuota !== 'cuota inscripcion');
                if (cuotaMensual) {
                    throw new BadRequestError('Primero debe abonar todas las cuotas de inscripcion');
                }
            }
        }
        return await createOrder(infoCuotas);
    }
    async reciveWebhook(dataId) {
        return await findOrder(dataId);
    }
    async aprobracionDebitoAutomatico(socioId, transactionAmount) {
        const socio = await this.sociosApi.getSocioById(socioId);
        return await createSubscription(socio.dataValues.email, "2024-04-15T13:30:00.000-03:00", transactionAmount);
    }
    async crearCliente(socioEmail) {
        return await createClient(socioEmail);
    }
    async cancelarDebitoAutomatico() {
    }
    async modificarDebitoAutomatico() {
    }
}
//# sourceMappingURL=pagos.js.map