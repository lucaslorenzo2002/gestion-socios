import asyncHandler from 'express-async-handler';
import { TiposSocioApi } from '../services/tiposSocio.js';
export class TiposSocioController {
    constructor() {
        this.createTipoSocio = asyncHandler(async (req, res) => {
            const { tipoSocio } = req.body;
            const { club_asociado } = req.user;
            await this.tiposSocioApi.createTipoSocio(tipoSocio, club_asociado.id);
            res.status(201).json({ success: true, message: 'nuevo tipo de socio creado' });
        });
        this.getTiposSocio = asyncHandler(async (req, res) => {
            const { club_asociado } = req.user;
            const tiposSocio = await this.tiposSocioApi.getTiposSocio(club_asociado.id);
            res.status(201).json({ success: true, data: tiposSocio });
        });
        this.tiposSocioApi = new TiposSocioApi();
    }
}
//# sourceMappingURL=tiposSocio.js.map