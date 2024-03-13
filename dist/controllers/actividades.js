import asyncHandler from 'express-async-handler';
import { ActividadesApi } from '../services/actividades.js';
export class ActividadesController {
    constructor() {
        this.createActividad = asyncHandler(async (req, res) => {
            const { actividad, limiteDeJugadores, categorias, poseeCategorias } = req.body;
            const { club_asociado } = req.user;
            await this.actividadesApi.createActividad(actividad, limiteDeJugadores, club_asociado.id, categorias, poseeCategorias);
            res.status(201).json({ success: true, message: 'nueva actividad creada' });
        });
        this.getActividades = asyncHandler(async (req, res) => {
            const { club_asociado } = req.user;
            const actividades = await this.actividadesApi.getActividades(club_asociado.id);
            res.status(201).json({ success: true, data: actividades });
        });
        this.crearSocioActividadYCategoria = asyncHandler(async (req, res) => {
            const { sociosId } = req.body;
            const { actividadid, categoriaid } = req.params;
            const { club_asociado } = req.user;
            const createSocioActividad = await this.actividadesApi.createSocioActividadYSocioCategoria(sociosId, actividadid, categoriaid, club_asociado.id);
            res.status(201).json({ success: true, message: 'Socios asignados al deporte con exito' });
        });
        this.crearSocioActividad = asyncHandler(async (req, res) => {
            const { sociosId } = req.body;
            const { actividadid } = req.params;
            const { club_asociado } = req.user;
            await this.actividadesApi.createSocioActividad(sociosId, actividadid, club_asociado.id);
            res.status(201).json({ success: true, message: 'Socios asignados al deporte con exito' });
        });
        this.eliminarSocioActividadYCategoria = asyncHandler(async (req, res) => {
            const { sociosId } = req.body;
            const { actividadid, categoriaid } = req.params;
            const { club_asociado } = req.user;
            await this.actividadesApi.eliminarSocioActividadYCategoria(sociosId, actividadid, club_asociado.id, categoriaid);
            res.status(201).json({ success: true, message: 'Socios eliminados de la categoria con exito' });
        });
        this.eliminarSocioActividad = asyncHandler(async (req, res) => {
            const { actividadid } = req.params;
            const { club_asociado } = req.user;
            const { sociosId } = req.body;
            await this.actividadesApi.eliminarSocioActividad(sociosId, actividadid, club_asociado.id);
            res.status(201).json({ success: true, message: 'Socios eliminados de la actividad' });
        });
        this.getAllSociosEnActividad = asyncHandler(async (req, res) => {
            const { actividadid } = req.params;
            const { club_asociado } = req.user;
            const socios = await this.actividadesApi.getAllSociosEnActividad(actividadid, club_asociado.id);
            res.status(201).json({ success: true, data: socios });
        });
        this.getAllSociosSinActividad = asyncHandler(async (req, res) => {
            const { actividadid } = req.params;
            const { club_asociado } = req.user;
            const socios = await this.actividadesApi.getAllSociosSinActividad(actividadid, club_asociado.id);
            res.status(201).json({ success: true, data: socios });
        });
        this.getSocioActividades = asyncHandler(async (req, res) => {
            if (req.params) {
                const actividades = await this.actividadesApi.getSocioActividad(req.params.socioid);
                res.status(201).json({ success: true, data: actividades });
            }
            else {
                const actividades = await this.actividadesApi.getSocioActividad(req.user.id);
                res.status(201).json({ success: true, data: actividades });
            }
        });
        this.eliminarActividad = asyncHandler(async (req, res) => {
            await this.actividadesApi.eliminarActividad(req.params.id, req.user.club_asociado.id);
            res.status(201).json({ success: true, message: 'actividad eliminada con exito' });
        });
        this.actividadesApi = new ActividadesApi();
    }
}
//# sourceMappingURL=actividades.js.map