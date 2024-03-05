import asyncHandler from 'express-async-handler';
import {ActividadesApi} from '../services/actividades.js';

export class ActividadesController{
	actividadesApi: ActividadesApi;
	constructor(){
		this.actividadesApi = new ActividadesApi();
	}

	createActividad = asyncHandler(async(req: any, res) => {
		try {
			const{actividad, limiteDeJugadores, categorias, poseeCategorias} = req.body;
			await this.actividadesApi.createActividad(
				actividad, 
				limiteDeJugadores, 
				req.user.club_asociado.id,
				categorias,
				poseeCategorias
				);
			res.status(201).json({success: true, message: 'nueva actividad creada'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getActividades = asyncHandler(async(req: any, res) => {
		try {
			const actividades = await this.actividadesApi.getActividades(req.user.club_asociado.id);
			res.status(201).json({success: true, data: actividades});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	

	crearSocioActividadYCategoria = asyncHandler(async(req: any, res) => {
		try {
			const {sociosId} = req.body;
			const {actividadid, categoriaid} = req.params;
			const{club_asociado} = req.user
			const createSocioActividad = await this.actividadesApi.createSocioActividadYSocioCategoria(sociosId, actividadid, categoriaid, club_asociado.id)
			if(createSocioActividad !== undefined){
				res.status(500).json({success: false, message: createSocioActividad});
			}else{
				res.status(201).json({success: true, message: 'Socios asignados al deporte con exito'});
			}
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	 

	crearSocioActividad = asyncHandler(async(req: any, res) => {
		try {
			const{sociosId} = req.body;
			const{actividadid} = req.params;
			const{club_asociado} = req.user;
			await this.actividadesApi.createSocioActividad(sociosId, actividadid, club_asociado.id);
			res.status(201).json({success: true, message: 'Socios asignados al deporte con exito'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	eliminarSocioActividadYCategoria = asyncHandler(async(req: any, res) => {
		try {
			const {sociosId} = req.body;
			const {actividadid, categoriaid} = req.params;
			const{club_asociado} = req.user
			await this.actividadesApi.eliminarSocioActividadYCategoria(sociosId, actividadid, club_asociado.id, categoriaid);

			res.status(201).json({success: true, message: 'Socios eliminados de la categoria con exito'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	 

	eliminarSocioActividad = asyncHandler(async(req: any, res) => {
		try {
			const {actividadid} = req.params;
			const{club_asociado} = req.user;
			const {sociosId} = req.body;
			await this.actividadesApi.eliminarSocioActividad(sociosId, actividadid, club_asociado.id)
			res.status(201).json({success: true, message: 'Socios eliminados de la actividad'});
		} catch (err) {
			res.status(500).json({success: false, message: err.message});
		}
	});	  

	getAllSociosEnActividad = asyncHandler(async(req: any, res) => {
		try {
			const {actividadid} = req.params;
			const{club_asociado} = req.user;
			const socios = await this.actividadesApi.getAllSociosEnActividad(actividadid, club_asociado.id);
			res.status(201).json({success: true, data: socios});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	 

	getAllSociosSinActividad = asyncHandler(async(req: any, res) => {
		try {
			const {actividadid} = req.params;
			const{club_asociado} = req.user
			const socios = await this.actividadesApi.getAllSociosSinActividad(actividadid, club_asociado.id)
			res.status(201).json({success: true, data: socios});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getSocioActividades = asyncHandler(async(req: any, res) => {
		try {
			if(req.params){
				const actividades = await this.actividadesApi.getSocioActividad(req.params.socioid);
				res.status(201).json({success: true, data: actividades});
			}else{
				const actividades = await this.actividadesApi.getSocioActividad(req.user.id);
				res.status(201).json({success: true, data: actividades});
			}
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	eliminarActividad = asyncHandler(async(req: any, res) => {
		try {
			await this.actividadesApi.eliminarActividad(req.params.id, req.user.club_asociado.id);
			res.status(201).json({success: true, message: 'actividad eliminada con exito'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  
}
