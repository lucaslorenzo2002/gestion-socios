import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { DebitoAutomaticoApi } from '../services/debitoAutomatico.js';

export class DebitoAutomaticoController{
    debitoAutomaticoApi: DebitoAutomaticoApi;
	constructor(){
        this.debitoAutomaticoApi = new DebitoAutomaticoApi
	}

	habilitarDebitoAutomatico = asyncHandler(async(req: any, res: Response) => {
                const {club_asociado} = req.user;
                const{mediosDePago} = req.body;
                await this.debitoAutomaticoApi.habilitarDebitoAutomatico(club_asociado.id, mediosDePago)

                res.status(201).json({success: true, message: 'Debito automatico habilitado con exito'});
	});	

	getAllMediosDePagoInDebitoAutomatico = asyncHandler(async(req: any, res: Response) => {
                const {club_asociado} = req.user;
                const mediosDePago = await this.debitoAutomaticoApi.getAllMediosDePagoInDebitoAutomatico(club_asociado.id);

                res.status(201).json({success: true, data: mediosDePago});
	});	     

}