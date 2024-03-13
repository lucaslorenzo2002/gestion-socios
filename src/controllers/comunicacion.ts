import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { ComunicacionApi } from '../services/comunicacion.js';
import { RequestValidationError } from '../errors/request-validation-error.js';
import { validationResult } from 'express-validator';

export class ComunicacionController{
	comunicacionApi: ComunicacionApi;
	constructor(){
		this.comunicacionApi = new ComunicacionApi();
	}

	enviarMailsIndividualizados = asyncHandler(async(req: any, res: Response) => {
        const {message, subject, mails} = req.body;
        
        const errors = validationResult(req);

		if(!errors.isEmpty()){
			throw new RequestValidationError(errors.array());
		}
		
        await this.comunicacionApi.enviarMailsIndividualizado(message, subject, mails);
        
        res.status(201).json({success: true, message: 'Los mails han sido enviados correctamente'});
	});	  

	enviarMailsMasivos = asyncHandler(async(req: any, res: Response) => {
        const {actividadId, tipoDeSocioId, message, subject} = req.body;
        const {club_asociado} = req.user;

        await this.comunicacionApi.enviarMailsMasivos(message, subject, actividadId, tipoDeSocioId, club_asociado.id);
        
        res.status(201).json({success: true, message: 'Los mails han sido enviados correctamente'});
	});	  


}