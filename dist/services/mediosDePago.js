import { MediosDePagoDAO } from '../database/mediosDePago.js';
export class MediosDePagoApi {
    constructor() {
        this.mediosDePagoDAO = new MediosDePagoDAO();
    }
    async getAllMediosDePago() {
        return await this.mediosDePagoDAO.getAllMediosDePago();
    }
}
//# sourceMappingURL=mediosDePago.js.map