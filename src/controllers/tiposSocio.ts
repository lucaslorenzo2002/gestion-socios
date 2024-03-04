import asyncHandler from 'express-async-handler';
import {TiposSocioApi} from '../services/tiposSocio.js';

export class TiposSocioController{
	tiposSocioApi: TiposSocioApi;
	constructor(){
		this.tiposSocioApi = new TiposSocioApi();
	}

	createTipoSocio = asyncHandler(async(req: any, res) => {
		try {
			await this.tiposSocioApi.createTipoSocio(req.body.tipoSocio, req.user.club_asociado.id);
			res.status(201).json({success: true, message: 'nuevo tipo de socio creado'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getTiposSocio = asyncHandler(async(req: any, res) => {
		try {
			const tiposSocio = await this.tiposSocioApi.getTiposSocio(req.user.club_asociado.id);
			res.status(201).json({success: true, data: tiposSocio});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  
}