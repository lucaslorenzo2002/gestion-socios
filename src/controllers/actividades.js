const asyncHandler = require('express-async-handler');
const ActividadesApi = require('../services/actividades');

class ActividadesController{
	constructor(){
		this.actividadesApi = new ActividadesApi();
	}

	createActividad = asyncHandler(async(req, res) => {
		try {
			await this.actividadesApi.createActividad(req.body.actividad, req.user.club_asociado.nombre);
			res.status(201).json({success: true, message: 'nueva actividad creada'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getActividades = asyncHandler(async(req, res) => {
		try {
			const actividades = await this.actividadesApi.getActividades(req.user.club_asociado.nombre);
			res.status(201).json({success: true, data: actividades});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getSocioActividades = asyncHandler(async(req, res) => {
		try {
			const actividades = await this.actividadesApi.getSocioActividad(req.user.id);
			res.status(201).json({success: true, data: actividades});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	eliminarActividad = asyncHandler(async(req, res) => {
		try {
			await this.actividadesApi.eliminarActividad(req.params.id, req.user.club_asociado.nombre);
			res.status(201).json({success: true, message: 'actividad eliminada con exito'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  
}

module.exports = ActividadesController;