import { Actividad_Socio } from '../models/actividad_socio.js';
import { CategoriaSocio } from '../models/categoriaSocio.js';
import { CategoriaSocio_Socio } from '../models/categoriaSocio_socio.js';
import { Socio } from '../models/socio.js';
import logger from '../utils/logger.js';
export class CategoriasSocioDAO {
    async createCategoriaSocio(newCategoriaSocio) {
        try {
            return await CategoriaSocio.create(newCategoriaSocio);
        }
        catch (err) {
            logger.info(err);
        }
    }
    async createCategoriaSocioAndActividad(newCategoriaSocio, newActividadSocio, categoriaId) {
        try {
            await Actividad_Socio.create(newActividadSocio);
            const cantidadDeJugadores = await CategoriaSocio_Socio.count({
                where: {
                    categoria_socio_id: categoriaId
                }
            });
            await CategoriaSocio_Socio.create(newCategoriaSocio);
            await this.actualizarCategoriaCantidadDeJugadores(cantidadDeJugadores + 1, categoriaId);
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getCategoriasActividad(club, actividadId) {
        try {
            return await CategoriaSocio.findAll({
                where: {
                    club_asociado_id: club,
                    actividad_id: actividadId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getAllCategorias(club) {
        try {
            return await CategoriaSocio.findAll({
                order: [['createdAt', 'DESC']],
                attributes: ['categoria', 'id', 'actividad_id'],
                where: {
                    club,
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getAllSociosEnCategoria(actividadId, categoriaId, clubAsociado) {
        try {
            return await CategoriaSocio_Socio.findAll({
                attributes: ['socio_id'],
                include: [
                    {
                        model: Socio,
                        attributes: ['id', 'nombres', 'apellido']
                    }
                ],
                where: {
                    actividad_id: actividadId,
                    categoria_socio_id: categoriaId,
                    club_asociado_id: clubAsociado
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async createCategoriaSocioSocio(categoriaSocioSocio) {
        try {
            return await CategoriaSocio_Socio.create(categoriaSocioSocio);
        }
        catch (err) {
            logger.info(err);
        }
    }
    async eliminarCategoriaSocioSocio(socioId, categoriaId, club) {
        try {
            const cantidadDeJugadores = await CategoriaSocio_Socio.count({
                where: {
                    categoria_socio_id: categoriaId
                }
            });
            await CategoriaSocio_Socio.destroy({
                where: {
                    socio_id: socioId,
                    categoria_socio_id: categoriaId,
                    club_asociado_id: club
                }
            });
            await this.actualizarCategoriaCantidadDeJugadores(cantidadDeJugadores - 1, categoriaId);
        }
        catch (err) {
            logger.info(err);
        }
    }
    async actualizarCategoriaCantidadDeJugadores(cantidadDeJugadores, id) {
        try {
            return await CategoriaSocio.update({
                cantidad_de_jugadores: cantidadDeJugadores
            }, {
                where: {
                    id: id
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getCantidadDeJugadoresCategoriaById(id) {
        try {
            return await CategoriaSocio.findByPk(id, {
                attributes: ['cantidad_de_jugadores', 'limite_de_jugadores']
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async cantidadDeCategoriasEnActividad(actividadId) {
        try {
            return await CategoriaSocio.count({
                where: {
                    actividad_id: actividadId
                },
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async eliminarCategoria(id, club) {
        try {
            await Actividad_Socio.destroy({
                where: {
                    categoria_socio_id: id,
                    club_asociado_id: club
                }
            });
            await CategoriaSocio_Socio.destroy({
                where: {
                    categoria_socio_id: id,
                    club_asociado_id: club
                }
            });
            await CategoriaSocio.destroy({
                where: {
                    id,
                    club_asociado_id: club
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
}
//# sourceMappingURL=categoriasSocio.js.map