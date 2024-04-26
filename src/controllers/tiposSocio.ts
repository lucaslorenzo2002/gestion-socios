import asyncHandler from 'express-async-handler';
import {TiposSocioApi} from '../services/tiposSocio.js';

export class TiposSocioController{
	tiposSocioApi: TiposSocioApi;
	constructor(){
		this.tiposSocioApi = new TiposSocioApi();
	}

	createTipoSocio = asyncHandler(async(req: any, res) => {
		const {tipoSocio} = req.body;
		const {club_asociado} = req.user;
		await this.tiposSocioApi.createTipoSocio(tipoSocio, club_asociado.id);

		res.status(201).json({success: true, message: 'nuevo tipo de socio creado'});
	});	  

	getTiposSocio = asyncHandler(async(req: any, res) => {
		const {club_asociado} = req.user;
		const tiposSocio = await this.tiposSocioApi.getTiposSocio(club_asociado.id);

		res.status(201).json({success: true, data: tiposSocio});
	});	  
}