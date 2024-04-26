import { Op } from 'sequelize';
import { Actividad } from '../models/actividad.js';
import { Actividad_Socio } from '../models/actividad_socio.js';
import { CategoriaSocio } from '../models/categoriaSocio.js';
import { Socio } from '../models/socio.js';
import logger from '../utils/logger.js';
import { CategoriaSocio_Socio } from '../models/categoriaSocio_socio.js';
import { Transaccion } from '../models/transaccion.js';
import { Grupo_familiar } from '../models/grupo_familiar.js';
export class ActividadesDAO {
    async crearActividad(actividad) {
        try {
            return await Actividad.create(actividad);
        }
        catch (err) {
            logger.info(err);
        }
    }
    async crearSocioActividad(socioActividad, actividadId) {
        try {
            const cantidadDeJugadores = await Actividad_Socio.count({
                where: {
                    actividad_id: actividadId
                }
            });
            await Actividad_Socio.create(socioActividad);
            await this.actualizarActividadCantidadDeJugadores(cantidadDeJugadores + 1, actividadId);
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getActividadById(id) {
        try {
            return await Actividad.findByPk(id);
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getAllSociosEnActividad(actividadId, clubAsociado) {
        try {
            return await Actividad_Socio.findAll({
                include: [
                    {
                        model: Socio,
                        attributes: ['id', 'nombres', 'apellido', 'grupo_familiar_id'],
                        include: [
                            {
                                model: Grupo_familiar,
                                attributes: ['familiar_titular_id']
                            }
                        ]
                    }
                ],
                where: {
                    actividad_id: actividadId,
                    club_asociado_id: clubAsociado
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getCantidadDeJugadoresActividadById(id) {
        try {
            return await Actividad.findByPk(id, {
                attributes: ['cantidad_de_jugadores', 'limite_de_jugadores']
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async actualizarActividadCantidadDeJugadores(cantidadDeJugadores, id) {
        try {
            return await Actividad.update({
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
    async getAllSociosSinActividad(actividadId, clubAsociado) {
        try {
            const sociosEnActividad = await Actividad_Socio.findAll({
                attributes: ['socio_id'],
                where: {
                    actividad_id: actividadId,
                    club_asociado_id: clubAsociado
                }
            });
            const actividad = await Actividad.findOne({
                attributes: ['posee_cuota_inscripcion'],
                where: {
                    id: actividadId
                }
            });
            if (actividad.dataValues.posee_cuota_inscripcion) {
                const sociosPendientes = await Transaccion.findAll({
                    include: [
                        {
                            model: Socio,
                            attributes: ['id']
                        }
                    ],
                    attributes: ['socio_id'],
                    where: {
                        detalles: {
                            [Op.like]: `{"detalle":"Debe la cuota de inscripcion","actividadId":"${actividadId}"%}`
                        },
                        estado: 'PENDIENTE',
                        club_asociado_id: clubAsociado
                    }
                });
                const sociosEnActividadDTO = [];
                for (const socioEnActividad of sociosEnActividad) {
                    sociosEnActividadDTO.push(socioEnActividad.dataValues.socio_id);
                }
                for (const socioPendientes of sociosPendientes) {
                    sociosEnActividadDTO.push(socioPendientes.dataValues.socio_id);
                }
                if (sociosEnActividadDTO.length > 0) {
                    return await Socio.findAll({
                        attributes: ['id', 'nombres', 'apellido'],
                        where: {
                            [Op.not]: [
                                {
                                    id: { [Op.in]: sociosEnActividadDTO }
                                }
                            ],
                            club_asociado_id: clubAsociado
                        }
                    });
                }
                return await Socio.findAll({
                    attributes: ['id', 'nombres', 'apellido'],
                    where: {
                        club_asociado_id: clubAsociado
                    }
                });
            }
            const sociosEnActividadDTO = [];
            for (const socioEnActividad of sociosEnActividad) {
                sociosEnActividadDTO.push(socioEnActividad.dataValues.socio_id);
            }
            if (sociosEnActividadDTO.length > 0) {
                return await Socio.findAll({
                    attributes: ['id', 'nombres', 'apellido'],
                    where: {
                        [Op.not]: [
                            {
                                id: { [Op.in]: sociosEnActividadDTO }
                            }
                        ],
                        club_asociado_id: clubAsociado
                    }
                });
            }
            return await Socio.findAll({
                attributes: ['id', 'nombres', 'apellido'],
                where: {
                    club_asociado_id: clubAsociado
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getActividadByName(actividad) {
        try {
            return await Actividad.findOne({
                attributes: ['actividad'],
                where: {
                    actividad
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getSocioActividad(socioId) {
        try {
            return await Actividad_Socio.findAll({
                include: [{
                        model: Actividad,
                        attributes: ['actividad']
                    }, {
                        model: Socio,
                        attributes: ['nombres', 'apellido']
                    }, {
                        model: CategoriaSocio,
                        attributes: ['categoria']
                    }],
                where: {
                    socio_id: socioId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async eliminarSocioActividad(socioId, actividadId, club) {
        try {
            const cantidadDeJugadores = await Actividad_Socio.count({
                where: {
                    actividad_id: actividadId
                }
            });
            await Actividad_Socio.destroy({
                where: {
                    socio_id: socioId,
                    actividad_id: actividadId,
                    club_asociado_id: club
                }
            });
            await this.actualizarActividadCantidadDeJugadores(cantidadDeJugadores - 1, actividadId);
        }
        catch (error) {
            logger.info(error.message);
        }
    }
    async getActividades(club) {
        try {
            return await Actividad.findAll({
                order: [['createdAt', 'DESC']],
                where: {
                    club_asociado_id: club
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async eliminarActividad(id, club) {
        try {
            await Actividad_Socio.destroy({
                where: {
                    actividad_id: id,
                    club_asociado_id: club
                }
            });
            await CategoriaSocio_Socio.destroy({
                where: {
                    actividad_id: id,
                    club_asociado_id: club
                }
            });
            await CategoriaSocio.destroy({
                where: {
                    actividad_id: id,
                    club_asociado_id: club
                }
            });
            await Actividad.destroy({
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
    async getActividadSocio(socioId, actividadId, clubAsociadoId) {
        try {
            return await Actividad_Socio.findOne({
                where: {
                    socio_id: socioId,
                    actividad_id: actividadId,
                    club_asociado_id: clubAsociadoId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async updateSocioMesesAbonadosCuotaDeportiva(mesesAbonados, socioId, actividadId, clubAsociado) {
        try {
            return await Actividad_Socio.update({ meses_abonados_cuota_deporte: mesesAbonados }, {
                where: {
                    socio_id: socioId,
                    actividad_id: actividadId,
                    club_asociado_id: clubAsociado
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async cuotaInscripcionPendiente(socioId, actividadId, clubAsociadoId) {
        try {
            return await Actividad_Socio.update({ estado_inscripcion_cuota_deportiva: 'PENDIENTE' }, {
                where: {
                    socio_id: socioId,
                    actividad_id: actividadId,
                    club_asociado_id: clubAsociadoId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async cuotaInscripcionPaga(socioId, actividadId, clubAsociadoId) {
        try {
            return await Actividad_Socio.update({ estado_inscripcion_cuota_deportiva: 'PAGO' }, {
                where: {
                    estado_inscripcion_cuota_deportiva: 'PENDIENTE',
                    socio_id: socioId,
                    actividad_id: actividadId,
                    club_asociado_id: clubAsociadoId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
}
//# sourceMappingURL=actividades.js.map