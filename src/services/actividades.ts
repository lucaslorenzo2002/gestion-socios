import {ActividadesDAO} from '../database/actividades.js';
import { CategoriasSocioApi } from './categoriasSocio.js';

export class ActividadesApi{
	actividadesDAO: ActividadesDAO;
	categoriasApi: CategoriasSocioApi;
	constructor(){
		this.actividadesDAO = new ActividadesDAO();
		this.categoriasApi = new CategoriasSocioApi();
	}

	async createActividad(actividad: string, limiteDeJugadores, clubAsociadoId, categorias, poseeCategorias){
		//no me genera el id automaticamente, entoces lo creo de forma aleatoria
		if(poseeCategorias && categorias.length === 0) throw new Error('Debe asignar al menos una categoria');
		if(!poseeCategorias && categorias.length > 0) throw new Error('Elimine las categorias creadas antes de seguir');

		const nuevaActividad = await this.actividadesDAO.crearActividad({
			actividad, 
			club_asociado_id: clubAsociadoId,
			limite_de_jugadores: limiteDeJugadores, 
			id: Math.floor(Math.random() * 100000) + 1,
			posee_categorias: poseeCategorias
		});

		if(categorias.length > 0){
			for (const categoria of categorias) {
				await this.categoriasApi.createCategoriaSocio(
					categoria.categoria, 
					clubAsociadoId, 
					nuevaActividad.dataValues.id,
					categoria.limiteDeJugadores
					)
			}
		}
	}

	async createSocioActividadYSocioCategoria(sociosId, actividadId, categoriaSocioId, clubAsociadoId){
		const cantidadDeJugadoresCategoria = await this.categoriasApi.getCantidadDeJugadoresCategoriaById(categoriaSocioId);
		const crearCategoriaSocioSocio = await this.categoriasApi.createCategoriaSocioSocio(sociosId, categoriaSocioId, clubAsociadoId, actividadId)
		
		if(typeof crearCategoriaSocioSocio === 'string'){
			return crearCategoriaSocioSocio
		}
		
		await this.categoriasApi.actualizarCategoriaCantidadDeJugadores(cantidadDeJugadoresCategoria.dataValues.cantidad_de_jugadores + sociosId.length, categoriaSocioId);
		for (const socioId of sociosId) {
			await this.actividadesDAO.crearSocioActividad({
				socio_id: socioId,
				actividad_id: actividadId,
				categoria_socio_id: categoriaSocioId,
				club_asociado_id: clubAsociadoId
			})
		}
	}

	async createSocioActividad(sociosId, actividadId, clubAsociadoId){
		const cantidadDeJugadoresActividad = await this.actividadesDAO.getCantidadDeJugadoresActividadById(actividadId);
		let cantidadDeJugadoresActividadActualizada = cantidadDeJugadoresActividad.dataValues.cantidad_de_jugadores + sociosId.length;
		const limiteDeJugadores = cantidadDeJugadoresActividad.dataValues.limite_de_jugadores;

		if(limiteDeJugadores !== null && cantidadDeJugadoresActividadActualizada > limiteDeJugadores){
			return 'Excediste el limite de jugadores para el deporte'
		}

		await this.actividadesDAO.actualizarActividadCantidadDeJugadores(cantidadDeJugadoresActividadActualizada, actividadId)

		for (const socioId of sociosId) {
			await this.actividadesDAO.crearSocioActividad({
				socio_id: socioId,
				actividad_id: actividadId,
				club_asociado_id: clubAsociadoId
			})
		}
	}

	async eliminarSocioActividadYCategoria(sociosId, actividadId, club, categoriaSocioId){
		const cantidadDeJugadoresCategoria = await this.categoriasApi.getCantidadDeJugadoresCategoriaById(categoriaSocioId);
		let cantidadDeJugadoresCategoriaActualizado = cantidadDeJugadoresCategoria.dataValues.cantidad_de_jugadores - sociosId.length
		
		if(cantidadDeJugadoresCategoriaActualizado < 0){
			cantidadDeJugadoresCategoriaActualizado = 0
		}

		await this.categoriasApi.actualizarCategoriaCantidadDeJugadores(cantidadDeJugadoresCategoriaActualizado, categoriaSocioId)

		for (const socioId of sociosId) {
			await this.categoriasApi.eliminarCategoriaSocioSocio(socioId, categoriaSocioId, club)
			await this.actividadesDAO.eliminarSocioActividad(socioId, actividadId, club);
		}
	}

	async eliminarSocioActividad(sociosId, actividadId, club){
		const cantidadDeJugadoresActividad = await this.actividadesDAO.getCantidadDeJugadoresActividadById(actividadId);
		let cantidadDeJugadoresActividadActualizada = cantidadDeJugadoresActividad.dataValues.cantidad_de_jugadores - sociosId.length;

		await this.actividadesDAO.actualizarActividadCantidadDeJugadores(cantidadDeJugadoresActividadActualizada, actividadId)

		for (const socioId of sociosId) {
			await this.actividadesDAO.eliminarSocioActividad(socioId, actividadId, club);
		}
	}

	async getAllSociosEnActividad(actividadId, clubAsociadoId){
		const sociosEnActividad = await this.actividadesDAO.getAllSociosEnActividad(actividadId, clubAsociadoId);

		const sociosEnActividadDTO = [];

		for (const socioEnActividad of sociosEnActividad) {
			sociosEnActividadDTO.push(socioEnActividad.dataValues.Socio)
		}

		return sociosEnActividadDTO;
	}
	
	async getAllSociosSinActividad(actividadId, clubAsociadoId){
		return await this.actividadesDAO.getAllSociosSinActividad(actividadId, clubAsociadoId);
	}

	async getActividades(club){
		const actividades = await this.actividadesDAO.getActividades(club);

		let actividadesConCategoria = [];
		for (const actividad of actividades) {
			actividadesConCategoria.push({
				...actividad.dataValues,
				categorias: await this.categoriasApi.getCategoriasActividad(club, actividad.dataValues.id)
			})
		}

		return actividadesConCategoria
	}

	async getSocioActividad(socioId){
		return await this.actividadesDAO.getSocioActividad(socioId);
 	}

	async eliminarActividad(id, club){
		return await this.actividadesDAO.eliminarActividad(id, club);
	}
}
