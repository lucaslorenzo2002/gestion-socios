import asyncHandler from 'express-async-handler';
import { InscripcionesApi } from '../services/inscripciones.js';
export class InscripcionesController {
    constructor() {
        this.programarInscripcion = asyncHandler(async (req, res) => {
            const { club_asociado } = req.user;
            const { monto, frecuenciaDeAbono, tipoDeSocio, actividad, categorias } = req.body;
            await this.inscripcionesApi.programarInscripcion(frecuenciaDeAbono, parseInt(monto), tipoDeSocio, actividad, categorias || [], club_asociado.id);
            res.status(201).json({ success: true, message: 'Inscripcion programada con exito' });
        });
        this.getAllCuotasInscripcion = asyncHandler(async (req, res) => {
            const { club_asociado } = req.user;
            const cuotasInscripcion = await this.inscripcionesApi.getAllCuotasInscripcion(club_asociado.id);
            res.status(201).json({ success: true, data: cuotasInscripcion });
        });
        this.findInscripcionProgramada = asyncHandler(async (req, res) => {
            const { club_asociado } = req.user;
            const { tiposocioid, actividadid } = req.params;
            const cuotasInscripcion = await this.inscripcionesApi.findInscripcionProgramada(tiposocioid, actividadid, club_asociado.id);
            res.status(201).json({ success: true, data: cuotasInscripcion });
        });
        this.actualizarValorCuotaInscripcion = asyncHandler(async (req, res) => {
            const { club_asociado } = req.user;
            const { id } = req.params;
            const { monto } = req.body;
            await this.inscripcionesApi.actualizarValorCuotaInscripcion(id, monto, club_asociado.id);
            res.status(201).json({ success: true, message: 'Cuota de inscripcion actualizada con exito' });
        });
        this.eliminarCuotaInscripcion = asyncHandler(async (req, res) => {
            const { club_asociado } = req.user;
            const { id, tiposocioid, actividadid } = req.params;
            await this.inscripcionesApi.eliminarCuotaInscripcion(parseInt(id), parseInt(actividadid), parseInt(tiposocioid), club_asociado.id);
            res.status(201).json({ success: true, message: 'Cuota de inscripcion eliminada con exito' });
        });
        this.inscripcionesApi = new InscripcionesApi();
    }
}
//# sourceMappingURL=inscripciones.js.map