import { Op } from 'sequelize';
import { Socio } from '../models/socio.js';
import { Transaccion } from '../models/transaccion.js';
import logger from '../utils/logger.js';
import { BadRequestError } from '../errors/bad-request-error.js';
import { transaccionesEnum } from '../enums/transacciones.js';
import { Grupo_familiar } from '../models/grupo_familiar.js';
export class TransaccionesDAO {
    async iniciarTransaccion(socioId, motivo, detalles, clubAsociadoId) {
        try {
            if (motivo === transaccionesEnum.adherirseDebitoAutomatico || motivo === transaccionesEnum.inscripcionSocial) {
                const transaccionPendiente = await Transaccion.findOne({
                    where: {
                        motivo,
                        socio_id: socioId,
                        estado: 'PENDIENTE',
                        club_asociado_id: clubAsociadoId
                    }
                });
                if (transaccionPendiente) {
                    throw new BadRequestError(`Ya tiene una transaccion para ${motivo} pendiente`);
                }
                return await Transaccion.create({
                    motivo,
                    detalles,
                    socio_id: socioId,
                    club_asociado_id: clubAsociadoId
                });
            }
            const transaccionPendienteActividad = await Transaccion.findOne({
                where: {
                    motivo,
                    detalles,
                    socio_id: socioId,
                    estado: 'PENDIENTE',
                    club_asociado_id: clubAsociadoId
                }
            });
            if (transaccionPendienteActividad) {
                throw new BadRequestError(`Ya tiene una transaccion para ${motivo} pendiente`);
            }
            return await Transaccion.create({
                motivo,
                detalles,
                socio_id: socioId,
                club_asociado_id: clubAsociadoId
            });
        }
        catch (err) {
            throw new BadRequestError(err);
        }
    }
    async aprobarTransaccion(id, clubAsociadoId) {
        try {
            await Transaccion.update({ estado: 'APROBADO' }, {
                where: {
                    id: id,
                    club_asociado_id: clubAsociadoId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async rechazarTransaccion(id, clubAsociadoId) {
        try {
            await Transaccion.update({ estado: 'RECHAZADO' }, {
                where: {
                    id: id,
                    club_asociado_id: clubAsociadoId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getTransaccionesPendientesAdmin(clubAsociado) {
        try {
            return await Transaccion.findAll({
                include: [
                    {
                        model: Socio,
                        attributes: ['nombres', 'apellido']
                    }
                ],
                where: {
                    club_asociado_id: clubAsociado,
                    estado: 'PENDIENTE'
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getTransaccionesRealizadasAdmin(clubAsociado) {
        return await Transaccion.findAll({
            include: [
                {
                    model: Socio,
                    attributes: ['nombres', 'apellido']
                }
            ],
            where: {
                club_asociado_id: clubAsociado,
                estado: {
                    [Op.not]: 'PENDIENTE'
                }
            }
        });
    }
    catch(err) {
        logger.info(err);
    }
    async getTransaccionesSocio(socioId, clubAsociadoId) {
        try {
            return await Transaccion.findAll({
                where: {
                    socio_id: socioId,
                    club_asociado_id: clubAsociadoId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getTransaccionSocioByMotivo(motivo, socioId, actividadId, categoriaId, clubAsociadoId) {
        try {
            console.log(actividadId, categoriaId);
            if (motivo === transaccionesEnum.adherirseDebitoAutomatico || motivo === transaccionesEnum.inscripcionSocial) {
                return await Transaccion.findOne({
                    where: {
                        motivo,
                        socio_id: socioId,
                        club_asociado_id: clubAsociadoId
                    }
                });
            }
            if (actividadId && !categoriaId) {
                return await Transaccion.findOne({
                    where: {
                        motivo: transaccionesEnum.inscripcionDeportiva,
                        detalles: {
                            [Op.like]: `{"detalle":"Debe la cuota de inscripcion","actividadId":"${actividadId}"%}`
                        },
                        socio_id: socioId,
                        club_asociado_id: clubAsociadoId
                    }
                });
            }
            if (actividadId && categoriaId) {
                const transaccion = await Transaccion.findOne({
                    where: {
                        motivo: transaccionesEnum.inscripcionDeportiva,
                        detalles: `{"detalle":"Debe la cuota de inscripcion","actividadId":"${actividadId}","categoriaId":"${categoriaId}"}`,
                        socio_id: socioId,
                        club_asociado_id: clubAsociadoId
                    }
                });
                console.log(transaccion);
                return transaccion;
            }
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getTransaccionById(id, clubAsociadoId) {
        try {
            return await Transaccion.findOne({
                where: {
                    id,
                    club_asociado_id: clubAsociadoId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async eliminarTransaccion(id) {
        try {
            return await Transaccion.destroy({
                where: {
                    id
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async eliminarAllTransaccionesByMotivo(motivo, actividadId, categoriaId, clubAsociadoId) {
        try {
            if (!categoriaId) {
                await Transaccion.destroy({
                    where: {
                        motivo,
                        detalles: `{"detalle":"Debe la cuota de inscripcion","actividadId":"${actividadId}"}`,
                        club_asociado_id: clubAsociadoId
                    }
                });
            }
            else {
                await Transaccion.destroy({
                    where: {
                        motivo,
                        detalles: `{"detalle":"Debe la cuota de inscripcion","actividadId":"${actividadId}","categoriaId":"${categoriaId}"}`,
                        club_asociado_id: clubAsociadoId
                    }
                });
            }
        }
        catch (err) {
            logger.info(err);
        }
    }
    async sociosWithTransaccionesPendientesCuotaInscripcion(tipoSocioId, actividadId, categoriaId, clubAsociadoId) {
        try {
            if (tipoSocioId) {
                const socios = await Transaccion.findAll({
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
                    attributes: ['socio_id'],
                    where: {
                        detalles: `{"detalle":"Debe la cuota de inscripcion","tipoSocioId":"${tipoSocioId}"}`,
                        estado: 'PENDIENTE',
                        club_asociado_id: clubAsociadoId
                    }
                });
                return socios.map(socio => socio.Socio.dataValues);
            }
            if (actividadId && !categoriaId) {
                const socios = await Transaccion.findAll({
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
                    attributes: ['socio_id'],
                    where: {
                        detalles: {
                            [Op.like]: `{"detalle":"Debe la cuota de inscripcion","actividadId":"${actividadId}"%}`
                        },
                        estado: 'PENDIENTE',
                        club_asociado_id: clubAsociadoId
                    }
                });
                return socios.map(socio => socio.Socio.dataValues);
            }
            if (actividadId && categoriaId) {
                const socios = await Transaccion.findAll({
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
                    attributes: ['socio_id'],
                    where: {
                        detalles: `{"detalle":"Debe la cuota de inscripcion","actividadId":"${actividadId}","categoriaId":"${categoriaId}"}`,
                        estado: 'PENDIENTE',
                        club_asociado_id: clubAsociadoId
                    }
                });
                return socios.map(socio => socio.Socio.dataValues);
            }
        }
        catch (err) {
            logger.info(err);
        }
    }
}
//# sourceMappingURL=transacciones.js.map