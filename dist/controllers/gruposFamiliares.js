import asyncHandler from 'express-async-handler';
import { GruposFamiliaresApi } from '../services/gruposFamiliares.js';
export class GruposFamiliaresController {
    constructor() {
        this.crearGrupoFamiliar = asyncHandler(async (req, res) => {
            const { apellidoTitular, sociosId, familiarTitularId } = req.body;
            const { club_asociado } = req.user;
            await this.gruposFamiliaresApi.crearGrupoFamiliar(apellidoTitular, sociosId, familiarTitularId, club_asociado.id);
            res.status(201).json({ success: true, message: 'Grupo familiar creado con exito' });
        });
        this.getGruposFamiliares = asyncHandler(async (req, res) => {
            const { club_asociado } = req.user;
            const gruposFamiliares = await this.gruposFamiliaresApi.getGruposFamiliares(club_asociado.id);
            res.status(201).json({ success: true, data: gruposFamiliares });
        });
        this.eliminarGrupoFamiliar = asyncHandler(async (req, res) => {
            const { club_asociado } = req.user;
            const { grupofamiliarid } = req.params;
            await this.gruposFamiliaresApi.eliminarGrupoFamiliar(parseInt(grupofamiliarid), club_asociado.id);
            res.status(201).json({ success: true, message: 'Grupo familiar eliminado' });
        });
        this.crearDescuentoGrupoFamiliar = asyncHandler(async (req, res) => {
            const { descuentoCuota, cantidadDeFamiliares } = req.body;
            const { club_asociado } = req.user;
            await this.gruposFamiliaresApi.crearDescuentoGrupoFamiliar(descuentoCuota, cantidadDeFamiliares, club_asociado.id);
            res.status(201).json({ success: true, message: 'descuento creado con exito' });
        });
        this.getDescuentosGrupoFamiliar = asyncHandler(async (req, res) => {
            const { club_asociado } = req.user;
            const descuentos = await this.gruposFamiliaresApi.getDescuentosGrupoFamiliar(club_asociado.id);
            res.status(201).json({ success: true, data: descuentos });
        });
        this.eliminarDescuentoGrupoFamiliar = asyncHandler(async (req, res) => {
            const { descuentogrupofamiliarid } = req.params;
            const { club_asociado } = req.user;
            await this.gruposFamiliaresApi.eliminarDescuentoGrupoFamiliar(descuentogrupofamiliarid, club_asociado.id);
            res.status(201).json({ success: true, message: 'Descuento eliminado con exito' });
        });
        this.actualizarTitularFamilia = asyncHandler(async (req, res) => {
            const { club_asociado } = req.user;
            const { familiarTitularId } = req.body;
            const { id } = req.params;
            await this.gruposFamiliaresApi.actualizarTitularFamilia(familiarTitularId, id, club_asociado.id);
            res.status(201).json({ success: true, message: 'Titular actualizado con exito' });
        });
        this.gruposFamiliaresApi = new GruposFamiliaresApi();
    }
}
//# sourceMappingURL=gruposFamiliares.js.map