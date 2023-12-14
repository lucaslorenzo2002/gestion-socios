const asyncHandler = require('express-async-handler');
const CategoriasSocioApi = require('../services/categoriasSocio');

class CategoriasSocioController{
	constructor(){
		this.categoriasSocioApi = new CategoriasSocioApi();
	}

	createCategoriaSocio = asyncHandler(async(req, res) => {
		try {
			await this.categoriasSocioApi.createCategoriaSocio(req.body.categoria, req.user.club_asociado);
			res.status(201).json({success: true, message: 'nueva categoria creada'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getCategoriasSocio = asyncHandler(async(req, res) => {
		try {
			const categoriasSocio = await this.categoriasSocioApi.getCategoriasSocio(req.user.club_asociado);
			res.status(201).json({success: true, data: categoriasSocio});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	
}

module.exports = CategoriasSocioController;