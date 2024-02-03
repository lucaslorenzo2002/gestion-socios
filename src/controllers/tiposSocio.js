const asyncHandler = require('express-async-handler');
const TiposSocioApi = require('../services/tiposSocio');

class TiposSocioController{
	constructor(){
		this.tiposSocioApi = new TiposSocioApi();
	}

	createTipoSocio = asyncHandler(async(req, res) => {
		try {
			await this.tiposSocioApi.createTipoSocio(req.body.tipoSocio, req.user.club_asociado.nombre);
			res.status(201).json({success: true, message: 'nuevo tipo de socio creado'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getTiposSocio = asyncHandler(async(req, res) => {
		try {
			const tiposSocio = await this.tiposSocioApi.getTiposSocio(req.user.club_asociado.nombre);
			res.status(201).json({success: true, data: tiposSocio});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  
}

module.exports = TiposSocioController;