import { InscripcionesDAO } from '../database/inscripciones.js';
import { SociosDAO } from '../database/socios.js';
import { BadRequestError } from '../errors/bad-request-error.js';
export class InscripcionesApi {
    constructor() {
        this.inscripcionesDAO = new InscripcionesDAO();
        this.sociosDAO = new SociosDAO();
    }
    async programarInscripcion(frecuenciaDeAbono, monto, tipoDeSocioId, actividadId, categoriasId, clubAsociadoId) {
        if (monto < 1) {
            throw new BadRequestError('Monto invalido');
        }
        if (actividadId !== 1 && categoriasId.length > 1) {
            for (const categoriaId of categoriasId) {
                const inscripcionProgramada = await this.inscripcionesDAO.findInscripcionProgramada(tipoDeSocioId, actividadId, clubAsociadoId);
                if (inscripcionProgramada) {
                    continue;
                }
                await this.inscripcionesDAO.programarInscripcion({
                    frecuencia_de_abono: frecuenciaDeAbono,
                    monto,
                    actividad_id: actividadId,
                    categoria_id: categoriaId,
                    tipo_de_cuota: 'abono inscripcion',
                    club_asociado_id: clubAsociadoId
                }, null, actividadId);
            }
            return;
        }
        const inscripcionProgramada = await this.inscripcionesDAO.findInscripcionProgramada(tipoDeSocioId, actividadId, clubAsociadoId);
        if (inscripcionProgramada) {
            throw new BadRequestError('Ya existe una inscripcion de ese tipo');
        }
        return await this.inscripcionesDAO.programarInscripcion({
            frecuencia_de_abono: frecuenciaDeAbono,
            monto,
            actividad_id: actividadId !== 1 ? actividadId : null,
            categoria_id: categoriasId[0],
            tipo_socio_id: tipoDeSocioId,
            tipo_de_cuota: 'abono inscripcion',
            club_asociado_id: clubAsociadoId
        }, tipoDeSocioId, actividadId);
    }
    async findInscripcionProgramada(tipoSocioId, actividadId, clubAsociadoId) {
        return await this.inscripcionesDAO.findInscripcionProgramada(tipoSocioId, actividadId, clubAsociadoId);
    }
    async getInscripcionById(id, clubAsociadoId) {
        return await this.inscripcionesDAO.getInscripcionById(id, clubAsociadoId);
    }
    async cobrarInscripcionASocio(socioId, inscripcion, clubAsociadoId) {
        await this.inscripcionesDAO.cobrarInscripcionASocio({
            monto: inscripcion.monto,
            socio_id: socioId,
            inscripcion_id: inscripcion.id,
        });
    }
    async getAllCuotasInscripcion(clubAsociadoId) {
        return await this.inscripcionesDAO.getAllCuotasInscripcion(clubAsociadoId);
    }
    async actualizarValorCuotaInscripcion(id, monto, clubAsociadoId) {
        if (monto < 1) {
            throw new BadRequestError('Monto invalido');
        }
        return await this.inscripcionesDAO.actualizarValorCuotaInscripcion(id, monto, clubAsociadoId);
    }
    async eliminarCuotaInscripcion(id, actividadId, tipoSocioId, clubAsociadoId) {
        return await this.inscripcionesDAO.eliminarCuotaInscripcion(id, actividadId, tipoSocioId, clubAsociadoId);
    }
}
//# sourceMappingURL=inscripciones.js.map