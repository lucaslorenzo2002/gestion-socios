import { Actividad } from '../models/actividad.js';
import { CategoriaSocio } from '../models/categoriaSocio.js';
import { Inscripcion } from '../models/inscripcion.js';
import { Socio_Cuota } from '../models/socio_cuota.js';
import { TipoSocio } from '../models/tipoSocio.js';
import logger from '../utils/logger.js';
import { CuotasDAO } from './cuotas.js';
export class InscripcionesDAO {
    constructor() {
        this.cuotasDAO = new CuotasDAO();
    }
    async programarInscripcion(inscripcion, tipoSocioId, actividadId) {
        try {
            if (tipoSocioId) {
                await TipoSocio.update({ posee_cuota_inscripcion: true }, {
                    where: {
                        id: tipoSocioId
                    }
                });
            }
            if (actividadId) {
                await Actividad.update({ posee_cuota_inscripcion: true }, {
                    where: {
                        id: actividadId
                    }
                });
            }
            return await Inscripcion.create(inscripcion);
        }
        catch (err) {
            logger.info(err);
        }
    }
    async findInscripcionProgramada(tipoSocioId, actividadId, clubAsociadoId) {
        try {
            if (tipoSocioId) {
                return await Inscripcion.findOne({
                    where: {
                        tipo_socio_id: tipoSocioId,
                        club_asociado_id: clubAsociadoId
                    }
                });
            }
            else {
                return await Inscripcion.findOne({
                    where: {
                        actividad_id: actividadId,
                        club_asociado_id: clubAsociadoId
                    }
                });
            }
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getInscripcionById(id, clubAsociadoId) {
        try {
            return await Inscripcion.findOne({
                where: {
                    id,
                    club_asociado_id: clubAsociadoId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getAllCuotasInscripcion(clubAsociadoId) {
        try {
            return await Inscripcion.findAll({
                include: [
                    {
                        model: TipoSocio,
                        attributes: ['tipo_socio']
                    }, {
                        model: Actividad,
                        attributes: ['actividad']
                    }, {
                        model: CategoriaSocio,
                        attributes: ['categoria']
                    }
                ],
                where: {
                    club_asociado_id: clubAsociadoId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async cobrarInscripcionASocio(socioCuota) {
        try {
            return await Socio_Cuota.create(socioCuota);
        }
        catch (err) {
            logger.info(err);
        }
    }
    async actualizarValorCuotaInscripcion(id, monto, clubAsociadoId) {
        try {
            return await Inscripcion.update({ monto }, {
                where: {
                    id,
                    club_asociado_id: clubAsociadoId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async eliminarCuotaInscripcion(id, actividadId, tipoSocioId, clubAsociadoId) {
        try {
            if (tipoSocioId) {
                await TipoSocio.update({ posee_cuota_inscripcion: false }, {
                    where: {
                        id: tipoSocioId
                    }
                });
            }
            if (actividadId) {
                await Actividad.update({ posee_cuota_inscripcion: false }, {
                    where: {
                        id: actividadId
                    }
                });
            }
            await this.cuotasDAO.eliminarAllSocioCuotaByInscripcion(id, clubAsociadoId);
            return await Inscripcion.destroy({
                where: {
                    id,
                    club_asociado_id: clubAsociadoId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
}
//# sourceMappingURL=inscripciones.js.map