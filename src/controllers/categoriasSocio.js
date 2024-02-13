const asyncHandler = require('express-async-handler');
const CategoriasSocioApi = require('../services/categoriasSocio');

class CategoriasSocioController{
	constructor(){
		this.categoriasSocioApi = new CategoriasSocioApi();
	}

	createCategoriaSocio = asyncHandler(async(req, res) => {
		try {
			await this.categoriasSocioApi.createCategoriaSocio(req.body.categoria, req.user.club_asociado.nombre, req.body.actividadId);
			res.status(201).json({success: true, message: 'nueva categoria creada'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getCategoriasActividad = asyncHandler(async(req, res) => {
		try {
			const categoriasSocio = await this.categoriasSocioApi.getCategoriasActividad(req.user.club_asociado.nombre, req.body.actividadId);
			res.status(201).json({success: true, data: categoriasSocio});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getAllCategorias = asyncHandler(async(req, res) => {
		try {
			const categoriasSocio = await this.categoriasSocioApi.getAllCategorias(req.user.club_asociado.nombre);
			res.status(201).json({success: true, data: categoriasSocio});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	categoriasDeSocioConCuotasCreadas = asyncHandler(async(req, res) => {
		try {
			const data = await this.categoriasSocioApi.categoriasDeSocioConCuotasCreadas(req.user.club_asociado.nombre);
			res.status(201).json({success: true, data});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  
}

module.exports = CategoriasSocioController;