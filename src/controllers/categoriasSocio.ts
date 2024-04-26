import asyncHandler from 'express-async-handler';
import {CategoriasSocioApi} from '../services/categoriasSocio.js';

export class CategoriasSocioController{
	categoriasSocioApi: CategoriasSocioApi;
	constructor(){
		this.categoriasSocioApi = new CategoriasSocioApi();
	}

 	createCategoriaSocio = asyncHandler(async(req: any, res) => {
		try {
			const {categoria, limiteDeJugadores} = req.body;
			const {actividadid} = req.params;
			const {club_asociado} = req.user;
			await this.categoriasSocioApi.createCategoriaSocio(
				categoria, 
				club_asociado.id, 
				actividadid,
				limiteDeJugadores
				);
			res.status(201).json({success: true, message: 'nueva categoria creada'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});   

	getCategoriasActividad = asyncHandler(async(req: any, res) => {
		try {
			const categoriasSocio = await this.categoriasSocioApi.getCategoriasActividad(req.user.club_asociado.id, req.params.actividadid);
			res.status(201).json({success: true, data: categoriasSocio});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getAllSociosEnCategoria = asyncHandler(async(req: any, res) => {
		try {
			const {actividadid, categoriaid} = req.params;
			const{club_asociado} = req.user
			const socios = await this.categoriasSocioApi.getAllSociosEnCategoria(actividadid, categoriaid, club_asociado.id)
			console.log(socios)
			res.status(201).json({success: true, data: socios});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getAllCategorias = asyncHandler(async(req: any, res) => {
		try {
			const categoriasSocio = await this.categoriasSocioApi.getAllCategorias(req.user.club_asociado.id);
			res.status(201).json({success: true, data: categoriasSocio});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	eliminarCategoria = asyncHandler(async(req: any, res) => {
		const {id, actividadid} = req.params
		const {club_asociado} = req.user;
		await this.categoriasSocioApi.eliminarCategoriaSocio(id, actividadid, club_asociado.id);

		res.status(201).json({success: true, message: 'Categoria eliminada con exito'});
	});	  

}
