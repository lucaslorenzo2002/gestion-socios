import asyncHandler from 'express-async-handler';
import { MediosDePagoApi } from '../services/mediosDePago.js';
export class MediosDePagoController {
    constructor() {
        this.getAllMediosDePago = asyncHandler(async (req, res) => {
            const mediosDePago = await this.mediosDePagoApi.getAllMediosDePago();
            res.status(201).json({ success: true, data: mediosDePago });
        });
        this.mediosDePagoApi = new MediosDePagoApi();
    }
}
//# sourceMappingURL=mediosDePago.js.map