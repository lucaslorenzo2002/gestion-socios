import { CategoriasSocioDAO } from '../database/categoriasSocio.js';
export class CategoriasSocioApi {
    constructor() {
        this.categoriasSocioDAO = new CategoriasSocioDAO();
    }
    async createCategoriaSocio(categoria, club, actividadId, limiteDeJugadores) {
        return await this.categoriasSocioDAO.createCategoriaSocio({
            categoria,
            club_asociado_id: club,
            actividad_id: actividadId,
            limite_de_jugadores: limiteDeJugadores
        });
    }
    async getCategoriasActividad(club, actividadId) {
        return await this.categoriasSocioDAO.getCategoriasActividad(club, actividadId);
    }
    async getAllCategorias(club) {
        return await this.categoriasSocioDAO.getAllCategorias(club);
    }
    async actualizarCategoriaCantidadDeJugadores(cantidadDeJugadores, id) {
        return await this.categoriasSocioDAO.actualizarCategoriaCantidadDeJugadores(cantidadDeJugadores, id);
    }
    async getCantidadDeJugadoresCategoriaById(id) {
        return await this.categoriasSocioDAO.getCantidadDeJugadoresCategoriaById(id);
    }
    async createCategoriaSocioSocio(sociosId, categoriaSocioId, clubAsociadoId, actividadId) {
        const cantidadDeJugadoresCategoria = await this.getCantidadDeJugadoresCategoriaById(categoriaSocioId);
        let cantidadDeJugadoresCategoriaActualizada = cantidadDeJugadoresCategoria.dataValues.cantidad_de_jugadores + sociosId.length;
        const limiteDeJugadores = cantidadDeJugadoresCategoria.dataValues.limite_de_jugadores;
        if (limiteDeJugadores !== null && cantidadDeJugadoresCategoriaActualizada > limiteDeJugadores) {
            return 'Excediste el limite de jugadores para la categoria';
        }
        for (const socioId of sociosId) {
            await this.categoriasSocioDAO.createCategoriaSocioSocio({
                socio_id: socioId,
                categoria_socio_id: categoriaSocioId,
                club_asociado_id: clubAsociadoId,
                actividad_id: actividadId
            });
        }
    }
    async getAllSociosEnCategoria(actividadId, categoriaId, clubAsociadoId) {
        const sociosEnCategoria = await this.categoriasSocioDAO.getAllSociosEnCategoria(actividadId, categoriaId, clubAsociadoId);
        const sociosEnCategoriaDTO = [];
        for (const socioEnCategoria of sociosEnCategoria) {
            sociosEnCategoriaDTO.push(socioEnCategoria.dataValues.Socio);
        }
        return sociosEnCategoriaDTO;
    }
    async eliminarCategoriaSocioSocio(socioId, categoriaSocioId, clubAsociadoId) {
        return await this.categoriasSocioDAO.eliminarCategoriaSocioSocio(socioId, categoriaSocioId, clubAsociadoId);
    }
    async eliminarCategoriaSocio(categoriaSocioId, actividadId, clubAsociadoId) {
        const cantidadDeCategoriasEnActividad = await this.categoriasSocioDAO.cantidadDeCategoriasEnActividad(actividadId);
        if (cantidadDeCategoriasEnActividad === 1)
            throw new Error('El deporte debe tener al menos una categoria');
        return await this.categoriasSocioDAO.eliminarCategoria(categoriaSocioId, clubAsociadoId);
    }
}
//# sourceMappingURL=categoriasSocio.js.map