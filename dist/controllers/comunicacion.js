import asyncHandler from 'express-async-handler';
import { ComunicacionApi } from '../services/comunicacion.js';
import { RequestValidationError } from '../errors/request-validation-error.js';
import { validationResult } from 'express-validator';
export class ComunicacionController {
    constructor() {
        this.enviarMailsIndividualizados = asyncHandler(async (req, res) => {
            const { message, subject, mails } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new RequestValidationError(errors.array());
            }
            await this.comunicacionApi.enviarMailsIndividualizado(message, subject, mails);
            res.status(201).json({ success: true, message: 'Los mails han sido enviados correctamente' });
        });
        this.enviarMailsMasivos = asyncHandler(async (req, res) => {
            const { actividadId, tipoDeSocioId, categoriasId, message, subject } = req.body;
            console.log(actividadId, tipoDeSocioId);
            const { club_asociado } = req.user;
            await this.comunicacionApi.enviarMailsMasivos(message, subject, actividadId, tipoDeSocioId, categoriasId || [], club_asociado.id);
            res.status(201).json({ success: true, message: 'Los mails han sido enviados correctamente' });
        });
        this.comunicacionApi = new ComunicacionApi();
    }
}
//# sourceMappingURL=comunicacion.js.map