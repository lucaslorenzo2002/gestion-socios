import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { GruposFamiliaresApi } from '../services/gruposFamiliares.js';

export class GruposFamiliaresController{
    gruposFamiliaresApi: GruposFamiliaresApi;
	constructor(){
        this.gruposFamiliaresApi = new GruposFamiliaresApi()
	}

	crearGrupoFamiliar = asyncHandler(async(req: any, res: Response) => {
        const {apellidoTitular, sociosId, familiarTitularId} = req.body;
        const {club_asociado} = req.user; 
		await this.gruposFamiliaresApi.crearGrupoFamiliar(apellidoTitular, sociosId, familiarTitularId, club_asociado.id)

        res.status(201).json({success: true, message: 'Grupo familiar creado con exito'});
	});	

	getGruposFamiliares = asyncHandler(async(req: any, res: Response) => {
        const {club_asociado} = req.user; 
		const gruposFamiliares = await this.gruposFamiliaresApi.getGruposFamiliares(club_asociado.id)

        res.status(201).json({success: true, data: gruposFamiliares});
	});	

	eliminarGrupoFamiliar = asyncHandler(async(req: any, res: Response) => {
        const {club_asociado} = req.user; 
        const {grupofamiliarid} = req.params; 
		await this.gruposFamiliaresApi.eliminarGrupoFamiliar(parseInt(grupofamiliarid), club_asociado.id)

        res.status(201).json({success: true, message: 'Grupo familiar eliminado'});
	});	

    crearDescuentoGrupoFamiliar = asyncHandler(async(req: any, res: Response) => {
        const {descuentoCuota, cantidadDeFamiliares} = req.body;
        const {club_asociado} = req.user; 
		await this.gruposFamiliaresApi.crearDescuentoGrupoFamiliar(descuentoCuota, cantidadDeFamiliares, club_asociado.id)

        res.status(201).json({success: true, message: 'descuento creado con exito'});
	});	

    getDescuentosGrupoFamiliar = asyncHandler(async(req: any, res: Response) => {
        const {club_asociado} = req.user; 
		const descuentos = await this.gruposFamiliaresApi.getDescuentosGrupoFamiliar(club_asociado.id)

        res.status(201).json({success: true, data: descuentos});
	});	

    actualizarTitularFamilia = asyncHandler(async(req: any, res: Response) => {
        const {club_asociado} = req.user; 
        const {familiarTitularId} = req.body;
        const {id} = req.params;
		await this.gruposFamiliaresApi.actualizarTitularFamilia(familiarTitularId, id, club_asociado.id)

        res.status(201).json({success: true, message: 'Titular actualizado con exito'});
	});	
}