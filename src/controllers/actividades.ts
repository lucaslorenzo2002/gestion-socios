import asyncHandler from 'express-async-handler';
import {ActividadesApi} from '../services/actividades.js';
import { Request, Response } from 'express';

export class ActividadesController{
	actividadesApi: ActividadesApi;
	constructor(){
		this.actividadesApi = new ActividadesApi();
	}

	createActividad = asyncHandler(async(req: any, res: Response) => {
		const{
			actividad, 
			limiteDeJugadores, 
			categorias, 
			poseeCategorias
		} = req.body;
		const{club_asociado} = req.user;

		await this.actividadesApi.createActividad(
			actividad, 
			limiteDeJugadores, 
			club_asociado.id,
			categorias,
			poseeCategorias
			);
		
			res.status(201).json({success: true, message: 'nueva actividad creada'});
	});	  

	getActividades = asyncHandler(async(req: any, res) => {
		const {club_asociado} = req.user
		const actividades = await this.actividadesApi.getActividades(club_asociado.id);
		
		res.status(201).json({success: true, data: actividades});
	});	

	crearSocioActividadYCategoria = asyncHandler(async(req: any, res) => {
		const {sociosId} = req.body;
		const {actividadid, categoriaid} = req.params;
		const{club_asociado} = req.user
		await this.actividadesApi.asignarInscripcionDeportivaConCategoria(sociosId, actividadid, categoriaid, club_asociado.id)
			
		res.status(201).json({success: true, message: 'Socios asignados al deporte con exito'});	
	});	 

	asignarInscripcionDeportiva = asyncHandler(async(req: any, res) => {
		const{sociosId} = req.body;
		const{actividadid} = req.params;
		const{club_asociado} = req.user;
		await this.actividadesApi.asignarInscripcionDeportiva(sociosId, actividadid, club_asociado.id);

		
		res.status(201).json({success: true, message: 'Socios asignados al deporte con exito'});
	});	  

	eliminarSocioActividadYCategoria = asyncHandler(async(req: any, res) => {
		const {sociosId} = req.body;
		const {actividadid, categoriaid} = req.params;
		const{club_asociado} = req.user
		await this.actividadesApi.eliminarSocioActividadYCategoria(sociosId, actividadid, club_asociado.id, categoriaid);

		res.status(201).json({success: true, message: 'Socios eliminados de la categoria con exito'});
	});	 

	eliminarSocioActividad = asyncHandler(async(req: any, res) => {
		const {actividadid} = req.params;
		const{club_asociado} = req.user;
		const {sociosId} = req.body;
		await this.actividadesApi.eliminarSocioActividad(sociosId, actividadid, club_asociado.id)
		
		res.status(201).json({success: true, message: 'Socios eliminados de la actividad'});
	});	  

	getAllSociosEnActividad = asyncHandler(async(req: any, res) => {
		const {actividadid} = req.params;
		const{club_asociado} = req.user;
		const socios = await this.actividadesApi.getAllSociosEnActividad(actividadid, club_asociado.id);
		res.status(201).json({success: true, data: socios});
	});	 

	getAllSociosSinActividad = asyncHandler(async(req: any, res) => {
		const {actividadid} = req.params;
		const{club_asociado} = req.user
		const socios = await this.actividadesApi.getAllSociosSinActividad(actividadid, club_asociado.id)
		
		res.status(201).json({success: true, data: socios});
	});	  

	getSocioActividades = asyncHandler(async(req: any, res) => {
		const {id} = req.user;
		const actividades = await this.actividadesApi.getSocioActividad(req.user.id);

		res.status(201).json({success: true, data: actividades});
	});	 

	getSocioActividadesDesdeAdmin = asyncHandler(async(req: any, res) => {
		const {socioid} = req.params
		const actividades = await this.actividadesApi.getSocioActividad(socioid);

		res.status(201).json({success: true, data: actividades});
	});	  

	eliminarActividad = asyncHandler(async(req: any, res) => {
		await this.actividadesApi.eliminarActividad(req.params.id, req.user.club_asociado.id);
		res.status(201).json({success: true, message: 'actividad eliminada con exito'});  
	})	
}
