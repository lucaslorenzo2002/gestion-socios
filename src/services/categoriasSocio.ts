import { ActividadesDAO } from '../database/actividades.js';
import {CategoriasSocioDAO} from '../database/categoriasSocio.js';
import { CuotasDAO } from '../database/cuotas.js';
import { TransaccionesDAO } from '../database/transacciones.js';
import { transaccionesEnum } from '../enums/transacciones.js';
import { BadRequestError } from '../errors/bad-request-error.js';

export class CategoriasSocioApi{
	categoriasSocioDAO: any;
	cuotasDAO: CuotasDAO;
	actividadesDAO: ActividadesDAO;
	transaccionesDAO: TransaccionesDAO;
	constructor(){
		this.categoriasSocioDAO = new CategoriasSocioDAO();
		this.cuotasDAO = new CuotasDAO();
		this.actividadesDAO = new ActividadesDAO();
		this.transaccionesDAO = new TransaccionesDAO();
	}

	async createCategoriaSocio(categoria, club, actividadId, limiteDeJugadores){
		return await this.categoriasSocioDAO.createCategoriaSocio({
			categoria, 
			club_asociado_id: club, 
			actividad_id: actividadId,
			limite_de_jugadores: limiteDeJugadores
		});
	}

	async getCategoriasActividad(club, actividadId){
		return await this.categoriasSocioDAO.getCategoriasActividad(club, actividadId);
	}

	async getAllCategorias(club){
		return await this.categoriasSocioDAO.getAllCategorias(club);
	}

	async actualizarCategoriaCantidadDeJugadores(cantidadDeJugadores, id){
		return await this.categoriasSocioDAO.actualizarCategoriaCantidadDeJugadores(cantidadDeJugadores, id);
	}

	async getCantidadDeJugadoresCategoriaById(id){
		return await this.categoriasSocioDAO.getCantidadDeJugadoresCategoriaById(id);
	}

	async createCategoriaSocioSocio(sociosId: number[], categoriaSocioId: number, clubAsociadoId: number, actividadId: number){
		const cantidadDeJugadoresCategoria = await this.getCantidadDeJugadoresCategoriaById(categoriaSocioId);
		let cantidadDeJugadoresCategoriaActualizada = cantidadDeJugadoresCategoria.dataValues.cantidad_de_jugadores + sociosId.length;
		const limiteDeJugadores = cantidadDeJugadoresCategoria.dataValues.limite_de_jugadores;

		if(limiteDeJugadores !== null && cantidadDeJugadoresCategoriaActualizada > limiteDeJugadores){
			throw new BadRequestError('Excediste el limite de jugadores para la categoria')
		}

		for (const socioId of sociosId) {
			await this.categoriasSocioDAO.createCategoriaSocioSocio({
				socio_id: socioId,
				categoria_socio_id: categoriaSocioId,
				club_asociado_id: clubAsociadoId,
				actividad_id: actividadId
			})		
		}		
	}

	async getAllSociosEnCategoria(actividadId, categoriaId, clubAsociadoId){
		const sociosEnCategoria = await this.categoriasSocioDAO.getAllSociosEnCategoria(actividadId, categoriaId, clubAsociadoId);

		const sociosEnCategoriaDTO = [];

		for (const socioEnCategoria of sociosEnCategoria) {
			sociosEnCategoriaDTO.push(socioEnCategoria.dataValues.Socio)
		}

		return sociosEnCategoriaDTO;
	}

	async eliminarCategoriaSocioSocio(socioId: number, categoriaSocioId: number, clubAsociadoId: number){
		return await this.categoriasSocioDAO.eliminarCategoriaSocioSocio(socioId, categoriaSocioId, clubAsociadoId)				
	}

	async eliminarCategoriaSocio(categoriaSocioId: number, actividadId: number, clubAsociadoId: number){
		const cantidadDeCategoriasEnActividad = await this.categoriasSocioDAO.cantidadDeCategoriasEnActividad(actividadId)
		if(cantidadDeCategoriasEnActividad === 1) throw new Error('El deporte debe tener al menos una categoria');
		
		const actividad = await this.actividadesDAO.getActividadById(actividadId);
		if(actividad.dataValues.posee_cuota_inscripcion){
			await this.cuotasDAO.eliminarAllSocioCuotaByInscripcionInCategoria(actividadId, categoriaSocioId, clubAsociadoId);
			await this.transaccionesDAO.eliminarAllTransaccionesByMotivo(transaccionesEnum.inscripcionDeportiva,actividadId, categoriaSocioId, clubAsociadoId)
		}
		
		const cuotaProgramada = await this.cuotasDAO.findCuotaProgrmada(null, actividadId, categoriaSocioId, clubAsociadoId);
		if(cuotaProgramada){
			await this.cuotasDAO.eliminarCuotaProgramada(clubAsociadoId, null, actividadId, categoriaSocioId);
		}
		
		return await this.categoriasSocioDAO.eliminarCategoria(categoriaSocioId, clubAsociadoId)	
	}
}