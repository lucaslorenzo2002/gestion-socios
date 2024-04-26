import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { MediosDePagoApi } from '../services/mediosDePago.js';

export class MediosDePagoController{
	mediosDePagoApi: MediosDePagoApi;
	constructor(){
		this.mediosDePagoApi = new MediosDePagoApi();
	}

	getAllMediosDePago = asyncHandler(async(req: Request, res: Response) => {
        const mediosDePago = await this.mediosDePagoApi.getAllMediosDePago();
        
        res.status(201).json({success: true, data: mediosDePago});
	});	   

}