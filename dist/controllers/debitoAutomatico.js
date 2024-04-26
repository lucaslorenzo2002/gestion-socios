import asyncHandler from 'express-async-handler';
import { DebitoAutomaticoApi } from '../services/debitoAutomatico.js';
export class DebitoAutomaticoController {
    constructor() {
        this.habilitarDebitoAutomatico = asyncHandler(async (req, res) => {
            const { club_asociado } = req.user;
            const { mediosDePago } = req.body;
            await this.debitoAutomaticoApi.habilitarDebitoAutomatico(club_asociado.id, mediosDePago);
            res.status(201).json({ success: true, message: 'Debito automatico habilitado con exito' });
        });
        this.getAllMediosDePagoInDebitoAutomatico = asyncHandler(async (req, res) => {
            const { club_asociado } = req.user;
            const mediosDePago = await this.debitoAutomaticoApi.getAllMediosDePagoInDebitoAutomatico(club_asociado.id);
            res.status(201).json({ success: true, data: mediosDePago });
        });
        this.debitoAutomaticoApi = new DebitoAutomaticoApi;
    }
}
//# sourceMappingURL=debitoAutomatico.js.map