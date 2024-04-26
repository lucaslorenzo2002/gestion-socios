import { Op } from 'sequelize';
import { Actividad_Socio } from '../models/actividad_socio.js';
import { Socio } from '../models/socio.js';
import logger from '../utils/logger.js';
import { IncludeOptions } from './includeOptions.js';
import { Grupo_familiar } from '../models/grupo_familiar.js';
import { Descuento_grupo_familiar } from '../models/descuento_grupo_familiar.js';
import { DebitoAutomatico } from '../models/debitoAutomatico.js';
import { BadRequestError } from '../errors/bad-request-error.js';
import { Socio_Cuota } from '../models/socio_cuota.js';
import { CategoriaSocio_Socio } from '../models/categoriaSocio_socio.js';
export class SociosDAO {
    constructor() {
        this.getSocioIncludeOptions = new IncludeOptions();
    }
    async createSocio(newSocio) {
        try {
            return Socio.create(newSocio);
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getSocioByEmail(email) {
        try {
            return await Socio.findOne({
                where: {
                    email
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getSocioByCelular(celular) {
        try {
            return await Socio.findOne({
                where: {
                    telefono_celular: celular
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getSocioById(id) {
        try {
            return Socio.findOne({
                include: this.getSocioIncludeOptions.getUserIncludeOptions(),
                where: {
                    id
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    /* async getAllActividadSocios(clubAsociado: number){
        try {
            return await Actividad_Socio.findAll({
                where:{
                    club_asociado_id: clubAsociado
                }
            });
        } catch (err) {
            logger.info(err);
        }
    } */
    async getAllSocios(clubAsociado) {
        try {
            return await Socio.findAll({
                include: this.getSocioIncludeOptions.getUserIncludeOptions(),
                where: {
                    club_asociado_id: clubAsociado
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getAllSociosSinTipoSocio(clubAsociado) {
        try {
            return await Socio.findAll({
                where: {
                    club_asociado_id: clubAsociado,
                    tipo_socio_id: null,
                    estado_inscripcion_cuota_social: null
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getAllSociosEnTipoSocio(clubAsociado, tipoSocio) {
        try {
            return await Socio.findAll({
                where: {
                    club_asociado_id: clubAsociado,
                    tipo_socio_id: tipoSocio
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async completeSocioRegister(nroDocumento, email, password, sexo, tipoDeDocumento, celular) {
        try {
            return Socio.update({
                email,
                password,
                sexo,
                tipo_doc: tipoDeDocumento,
                telefono_celular: celular,
                perfil_completado: 42
            }, {
                where: {
                    id: nroDocumento
                }
            });
        }
        catch (error) {
            logger.info(error);
        }
    }
    async updateSocioPassword(socioId, newPassword) {
        try {
            return Socio.update({ password: newPassword }, {
                where: {
                    id: socioId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async updateSocioData(fecNacimiento, edad, telefonoCelular, codigoPostal, direccion, ciudad, provincia, poseeObraSocial, siglas, rnos, numeroDeAfiliados, denominacionDeObraSocial, perfilCompletado, id) {
        try {
            return Socio.update({
                fec_nacimiento: fecNacimiento,
                edad,
                telefono_celular: telefonoCelular,
                codigo_postal: codigoPostal,
                direccion,
                ciudad,
                provincia,
                posee_obra_social: poseeObraSocial,
                siglas,
                rnos,
                numero_de_afiliados: numeroDeAfiliados,
                denominacion_de_obra_social: denominacionDeObraSocial,
                perfil_completado: perfilCompletado
            }, {
                where: {
                    id
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async deleteUser(socioId) {
        try {
            return Socio.destroy({
                where: {
                    id: socioId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async activateSocio(socioNroDocumento) {
        try {
            return Socio.update({ validado: true }, {
                where: {
                    id: socioNroDocumento
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async darDeBaja(id) {
        try {
            await CategoriaSocio_Socio.destroy({
                where: {
                    socio_id: id
                }
            });
            await Actividad_Socio.destroy({
                where: {
                    socio_id: id
                }
            });
            return await Socio.update({ estado_socio: 'BAJA', tipo_socio_id: null }, {
                where: {
                    id,
                    estado_socio: 'ACTIVO'
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async darDeAlta(id) {
        try {
            return Socio.update({ estado_socio: 'ACTIVO' }, {
                where: {
                    id,
                    estado_socio: 'BAJA'
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async actualizarCategoriaDeSocio(id, categoria, club) {
        try {
            return Socio.update({ categoria_id: categoria }, {
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
    async actualizarActividadDeSocio(id, actividad, club) {
        try {
            return Socio.update({ actividad_id: actividad }, {
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
    async eliminarSocioDeTipoDeSocio(id, tipoSocioId, club) {
        try {
            return Socio.update({ tipo_socio_id: null }, {
                where: {
                    id,
                    club_asociado_id: club,
                    tipo_socio_id: tipoSocioId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async agregarSocioATipoDeSocio(id, tipoSocioId, club) {
        try {
            return Socio.update({ tipo_socio_id: tipoSocioId }, {
                where: {
                    id,
                    club_asociado_id: club,
                    tipo_socio_id: null
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async filterSociosCuotaByActividad(actividadId, categoriaId, club) {
        try {
            if (actividadId && !categoriaId) {
                return await Actividad_Socio.findAll({
                    attributes: ['socio_id'],
                    include: [{
                            model: Socio,
                            attributes: ['email', 'estado_socio', 'id', 'club_asociado_id']
                        }],
                    where: {
                        actividad_id: actividadId,
                        club_asociado_id: club
                    }
                });
            }
            else if (actividadId && categoriaId) {
                return await Actividad_Socio.findAll({
                    attributes: ['socio_id'],
                    include: [{
                            model: Socio,
                            attributes: ['email', 'estado_socio', 'id', 'grupo_familiar_id', 'club_asociado_id'],
                            include: [
                                {
                                    model: Grupo_familiar,
                                    attributes: ['familiar_titular_id', 'descuento_id', 'id', 'cantidad_de_familiares'],
                                    include: [
                                        {
                                            model: Descuento_grupo_familiar,
                                            attributes: ['descuento_cuota']
                                        }
                                    ]
                                }
                            ],
                        }],
                    where: {
                        actividad_id: actividadId,
                        categoria_socio_id: categoriaId,
                        club_asociado_id: club
                    }
                });
            }
        }
        catch (err) {
            logger.info(err);
        }
    }
    async filterSociosCuotaByTipoSocio(tipoSocio, club) {
        try {
            return await Socio.findAll({
                attributes: ['id', 'email', 'estado_socio', 'meses_abonados_cuota_social', 'grupo_familiar_id', 'club_asociado_id'],
                include: [
                    {
                        model: Grupo_familiar,
                        attributes: ['familiar_titular_id', 'descuento_id', 'id', 'cantidad_de_familiares'],
                        include: [
                            {
                                model: Descuento_grupo_familiar,
                                attributes: ['descuento_cuota']
                            }
                        ]
                    }
                ],
                where: {
                    tipo_socio_id: tipoSocio,
                    club_asociado_id: club
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async updateSocioMesesAbonadosCuotaSocial(mesesAbonados, clubAsociado, socioId) {
        try {
            return Socio.update({ meses_abonados_cuota_social: mesesAbonados }, {
                where: {
                    id: socioId,
                    club_asociado_id: clubAsociado
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getAllSociosWithEmail(clubAsociado) {
        try {
            return await Socio.findAll({
                attributes: ['id', 'nombres', 'apellido', 'email'],
                where: {
                    club_asociado_id: clubAsociado,
                    [Op.not]: [
                        {
                            email: null
                        }
                    ]
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getAllSociosWithEmailInActividadOrTipoSocio(actividadId, tipoSocio, categoriasId, clubAsociado) {
        try {
            console.log(tipoSocio, actividadId);
            if (tipoSocio && !actividadId) {
                console.log('entre');
                return await Socio.findAll({
                    attributes: ['email'],
                    where: {
                        tipo_socio_id: tipoSocio,
                        club_asociado_id: clubAsociado,
                        [Op.not]: [
                            {
                                email: null
                            }
                        ]
                    }
                });
            }
            else if (!tipoSocio && actividadId && categoriasId.length === 0) {
                return await Actividad_Socio.findAll({
                    include: [
                        {
                            model: Socio,
                            attributes: ['email'],
                            where: {
                                [Op.not]: [
                                    {
                                        email: null
                                    }
                                ]
                            }
                        }
                    ],
                    attributes: ['socio_id'],
                    where: {
                        actividad_id: actividadId,
                        club_asociado_id: clubAsociado
                    }
                });
            }
            else if (!tipoSocio && actividadId && categoriasId.length > 0) {
                return await Actividad_Socio.findAll({
                    include: [
                        {
                            model: Socio,
                            attributes: ['email'],
                            where: {
                                [Op.not]: [
                                    {
                                        email: null
                                    }
                                ]
                            }
                        }
                    ],
                    attributes: ['socio_id'],
                    where: {
                        actividad_id: actividadId,
                        categoria_socio_id: {
                            [Op.in]: categoriasId
                        },
                        club_asociado_id: clubAsociado
                    }
                });
            }
            else {
                return await Socio.findAll({
                    attributes: ['email'],
                    where: {
                        club_asociado_id: clubAsociado,
                        [Op.not]: [
                            {
                                email: null
                            }
                        ]
                    }
                });
            }
            return;
        }
        catch (err) {
            logger.info(err);
        }
    }
    async asignarSocioAGrupoFamiliar(socioId, grupoFamiliarId, clubAsociadoId) {
        try {
            return await Socio.update({ grupo_familiar_id: grupoFamiliarId }, {
                where: {
                    id: socioId,
                    club_asociado_id: clubAsociadoId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async eliminarSocioDeGrupoFamiliar(id, grupoFamiliarId, clubAsociadoId) {
        try {
            return await Socio.update({ grupo_familiar_id: null }, {
                where: {
                    id,
                    grupo_familiar_id: grupoFamiliarId,
                    club_asociado_id: clubAsociadoId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getSociosSinGrupoFamiliar(clubAsociadoId) {
        try {
            return await Socio.findAll({
                attributes: ['id', 'nombres', 'apellido'],
                where: {
                    grupo_familiar_id: null,
                    club_asociado_id: clubAsociadoId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getAllFamiliaresEnGrupoFamiliar(grupoFamiliarId, clubAsociadoId) {
        try {
            return await Socio.findAll({
                attributes: ['id', 'nombres', 'apellido'],
                include: [
                    {
                        model: Grupo_familiar,
                        attributes: ['familiar_titular_id']
                    }
                ],
                where: {
                    grupo_familiar_id: grupoFamiliarId,
                    club_asociado_id: clubAsociadoId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async adherirSocioAlDebitoAutomatico(id, clubAsociadoId) {
        try {
            const debitoAutomatico = DebitoAutomatico.findOne({
                where: {
                    club_asociado_id: clubAsociadoId
                }
            });
            if (debitoAutomatico) {
                return await Socio.update({ debito_automatico_activado: true }, {
                    where: {
                        id
                    }
                });
            }
            throw new BadRequestError('El club no tiene habilitado el debito automatico');
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getAllSociosEnDebitoAutomatico(clubAsociadoId) {
        try {
            return Socio.findAll({
                where: {
                    debito_automatico_activado: true,
                    club_asociado_id: clubAsociadoId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async cuotaInscripcionPendiente(id, clubAsociadoId) {
        try {
            return await Socio.update({ estado_inscripcion_cuota_social: 'PENDIENTE' }, {
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
    async cuotaInscripcionPaga(id, clubAsociadoId) {
        try {
            return await Socio.update({ estado_inscripcion_cuota_social: 'PAGO' }, {
                where: {
                    estado_inscripcion_cuota_social: 'PENDIENTE',
                    id,
                    club_asociado_id: clubAsociadoId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async sinCuotaInscripcion(id, clubAsociadoId) {
        try {
            return await Socio.update({ estado_inscripcion_cuota_social: null }, {
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
    async getAllSociosWithCuotaInscripcionPendiente(tipoSocioId, clubAsociadoId) {
        try {
            return await Socio.findAll({
                where: {
                    estado_inscripcion_cuota_social: 'PENDIENTE',
                    club_asociado_id: clubAsociadoId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getDeudaSocio(id) {
        const socio = await this.getSocioById(id);
        const condicion1 = socio.dataValues.grupo_familiar_id && socio.Grupo_familiar.dataValues.familiar_titular_id !== socio.dataValues.id;
        if (condicion1) {
            return 0;
        }
        const condicion2 = !socio.dataValues.grupo_familiar_id;
        if (condicion2) {
            return await Socio_Cuota.sum('monto', {
                where: {
                    estado: 'PENDIENTE',
                    socio_id: id
                }
            });
        }
        const condicion3 = socio.dataValues.grupo_familiar_id && socio.Grupo_familiar.dataValues.familiar_titular_id === socio.dataValues.id;
        if (condicion3) {
            const familiaresEnGrupo = await this.getAllFamiliaresEnGrupoFamiliar(socio.dataValues.grupo_familiar_id, socio.dataValues.club_asociado_id);
            const familiaresIds = familiaresEnGrupo.map(familiar => familiar.dataValues.id);
            return await Socio_Cuota.sum('monto', {
                where: {
                    estado: 'PENDIENTE',
                    socio_id: {
                        [Op.in]: familiaresIds
                    }
                }
            });
        }
    }
}
//# sourceMappingURL=socios.js.map