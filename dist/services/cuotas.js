import { CuotasDAO } from '../database/cuotas.js';
import { SociosApi } from '../services/socios.js';
import sendEmail from '../utils/sendEmail.js';
import { CategoriasSocioApi } from './categoriasSocio.js';
import moment from 'moment';
import cron from 'node-cron';
import logger from '../utils/logger.js';
import { ActividadesApi } from './actividades.js';
import { BadRequestError } from '../errors/bad-request-error.js';
import { mesesEnum } from '../enums/meses.js';
import { GruposFamiliaresApi } from './gruposFamiliares.js';
import { InscripcionesApi } from './inscripciones.js';
import { SociosDAO } from '../database/socios.js';
import { TransaccionesApi } from './transacciones.js';
import { transaccionesEnum } from '../enums/transacciones.js';
export class CuotasApi {
    constructor() {
        this.cuotasDAO = new CuotasDAO();
        this.sociosApi = new SociosApi();
        this.categoriasSocioApi = new CategoriasSocioApi();
        this.actividadesApi = new ActividadesApi();
        this.gruposFamiliaresApi = new GruposFamiliaresApi();
        this.jobsMap = new Map();
        this.actualizarCutasVencidasJobsMap = new Map();
        this.inscripcionesApi = new InscripcionesApi();
        this.sociosDAO = new SociosDAO();
        this.transaccionesApi = new TransaccionesApi();
    }
    async asignarCuotaAUnSocio(socioId, tipoSocioId, actividadId, categoriaId, clubAsociadoId) {
        let mesActual = new Date().getMonth() + 1;
        const añoActual = new Date().getFullYear();
        mesActual = mesActual < 10 ? `0${mesActual}` : mesActual.toString();
        const periodo = `${mesesEnum[mesActual]} ${añoActual}`;
        const cuota = await this.cuotasDAO.findCuotaByTipoAndPeriodo(periodo, tipoSocioId, actividadId, categoriaId, clubAsociadoId);
        const socio = await this.sociosApi.getSocioById(socioId);
        if (socio.dataValues.grupo_familiar_id) {
            const grupoFamiliar = await this.gruposFamiliaresApi.getGrupoFamiliarById(socio.dataValues.grupo_familiar_id);
            const descuentoCuota = grupoFamiliar.Descuento_grupo_familiar.dataValues.descuento_cuota;
            await this.cuotasDAO.createSocioCuota({
                monto: cuota.dataValues.monto - (cuota.dataValues.monto * descuentoCuota / 100),
                cuota_id: cuota.dataValues.id,
                socio_id: socioId,
                periodo
            });
        }
        else {
            await this.cuotasDAO.createSocioCuota({
                monto: cuota.dataValues.monto,
                cuota_id: cuota.dataValues.id,
                socio_id: socioId,
                periodo
            });
        }
    }
    async asignarCuotaASocios(cuotaParam, club) {
        try {
            const cuota = await this.cuotasDAO.findCuotaById(cuotaParam.dataValues.id);
            let message = `
        	<h2>PORFAVOR NO RESPONDER ESTE MENSAJE</h2>
        	<p>Estimado socio, se envia este mail para hacerle saber que tiene una nueva cuota.</p>
        	<p>Para pagar la misma debera ingresar a la aplicacion.</p> 
        	<p>Muchas gracias</p> 
        	<p>Administracion club ${club.nombre}</p> `;
            let from = process.env.EMAIL_USER;
            let subject = `${club.nombre}, AVISO DE NUEVA CUOTA`;
            let sociosTarget;
            if (cuota.dataValues.tipo_socio_id) {
                sociosTarget = await this.sociosApi.filterSociosCuotaByTipoSocio(cuota.dataValues.tipo_socio_id, club.id);
                for (let i = 0; i < sociosTarget.length; i++) {
                    if (sociosTarget[i].dataValues.estado_socio === 'BAJA') {
                        continue;
                    }
                    if (sociosTarget[i].dataValues.meses_abonados_cuota_social > 0) {
                        await this.sociosApi.updateSocioMesesAbonadosCuotaSocial(sociosTarget[i].dataValues.meses_abonados_cuota_social - 1, club.id, sociosTarget[i].dataValues.id);
                        continue;
                    }
                    if (sociosTarget[i].dataValues.grupo_familiar_id && sociosTarget[i].Grupo_familiar?.familiar_titular_id !== sociosTarget[i].dataValues.id) {
                        let socioIdString = sociosTarget[i].dataValues.id.toString().slice(-4);
                        const descuento = sociosTarget[i].Grupo_familiar.Descuento_grupo_familiar.descuento_cuota;
                        this.cuotasDAO.createSocioCuota({
                            id: parseInt(`${cuota.dataValues.id}${socioIdString}`),
                            cuota_id: cuota.dataValues.id,
                            socio_id: sociosTarget[i].dataValues.id,
                            monto: cuota.dataValues.monto - (cuota.dataValues.monto * descuento / 100),
                            periodo: cuota.dataValues.fecha_emision
                        });
                        continue;
                    }
                    let descuento = sociosTarget[i].Grupo_familiar?.dataValues.Descuento_grupo_familiar.descuento_cuota || 0;
                    let emailTo = sociosTarget[i].dataValues.email;
                    if (emailTo)
                        await sendEmail(from, emailTo, subject, message);
                    let socioIdString = sociosTarget[i].dataValues.id.toString().slice(-4);
                    this.cuotasDAO.createSocioCuota({
                        id: parseInt(`${cuota.dataValues.id}${socioIdString}`),
                        cuota_id: cuota.dataValues.id,
                        socio_id: sociosTarget[i].dataValues.id,
                        monto: cuota.dataValues.monto - (cuota.dataValues.monto * descuento / 100),
                        periodo: cuota.dataValues.fecha_emision
                    });
                }
            }
            else {
                const socios = await this.sociosApi.filterSociosCuotaByActividad(cuota.dataValues.actividad_id, cuota.dataValues.categoria_id, club.id);
                console.log(socios);
                sociosTarget = socios.map((socio) => socio.dataValues.Socio);
                let actividadSocio;
                for (let i = 0; i < sociosTarget.length; i++) {
                    if (sociosTarget[i].dataValues.estado_socio === 'BAJA') {
                        continue;
                    }
                    actividadSocio = await this.actividadesApi.getActividadSocio(sociosTarget[i].dataValues.id, cuota.dataValues.actividad_id, club.id);
                    if (actividadSocio.dataValues.meses_abonados_cuota_deporte > 0) {
                        await this.actividadesApi.updateSocioMesesAbonadosCuotaDeportiva(actividadSocio.dataValues.meses_abonados_cuota_deporte - 1, sociosTarget[i].dataValues.id, cuota.dataValues.actividad_id, club.id);
                        continue;
                    }
                    if (sociosTarget[i].dataValues.grupo_familiar_id && sociosTarget[i].Grupo_familiar.familiar_titular_id !== sociosTarget[i].dataValues.id) {
                        let socioIdString = sociosTarget[i].dataValues.id.toString().slice(-4);
                        this.cuotasDAO.createSocioCuota({
                            id: parseInt(`${cuota.dataValues.id}${socioIdString}`),
                            cuota_id: cuota.dataValues.id,
                            socio_id: sociosTarget[i].dataValues.id,
                            estado: 'PENDIENTE',
                            monto: cuota.dataValues.monto,
                            periodo: cuota.dataValues.fecha_emision
                        });
                        continue;
                    }
                    let emailTo = sociosTarget[i].dataValues.email;
                    if (emailTo)
                        await sendEmail(from, emailTo, subject, message);
                    let socioIdString = sociosTarget[i].dataValues.id.toString().slice(-4);
                    this.cuotasDAO.createSocioCuota({
                        id: parseInt(`${cuota.dataValues.id}${socioIdString}`),
                        cuota_id: cuota.dataValues.id,
                        socio_id: sociosTarget[i].dataValues.id,
                        monto: cuota.dataValues.monto,
                        periodo: cuota.dataValues.fecha_emision
                    });
                }
            }
        }
        catch (err) {
            throw new BadRequestError(err.message);
        }
    }
    async programarCuota(tipoDeCuota, fechaEmision, monto, to, actividadId, categoriasId, abonoMultiple, maxCantAbonoMult, diaDeVencimientoParam, actualizaMontoCuandoVence, frecuenciaInteres, montoPostVencimiento, interesCuota, club) {
        try {
            const mesCuota = [fechaEmision[3], fechaEmision[4]].join('').toString();
            const añoCuota = [fechaEmision[6], fechaEmision[7], fechaEmision[8], fechaEmision[9]].join('');
            const fechaEmisionMoment = moment(fechaEmision, 'DD-MM-YYYY');
            if (actividadId !== 1 && categoriasId.length > 1) {
                let cuota;
                for (const categoriaId of categoriasId) {
                    const cuotaYaExistente = await this.cuotasDAO.findCuotaProgrmada(null, actividadId, categoriaId, club.id);
                    if (cuotaYaExistente)
                        throw new BadRequestError('La cuota que intenta crear ya esta programada');
                    if (fechaEmisionMoment.isSameOrBefore(moment())) {
                        let fechaVencimiento;
                        if (mesCuota !== '02') {
                            fechaVencimiento = `30-${mesCuota}-${añoCuota}`;
                        }
                        else {
                            fechaVencimiento = `28-${mesCuota}-${añoCuota}`;
                        }
                        const cuotaProgramada = await this.cuotasDAO.programarCuota({
                            tipo_de_cuota: tipoDeCuota,
                            monto,
                            actividad_id: actividadId,
                            categoria_id: categoriaId,
                            abono_multiple: abonoMultiple,
                            maxima_cantidad_abono_multiple: maxCantAbonoMult,
                            club_asociado_id: club.id,
                            dia_de_vencimiento: diaDeVencimientoParam || 10,
                            actualiza_monto_cuando_vence: actualizaMontoCuandoVence || false,
                            frecuencia_interes: frecuenciaInteres,
                            interes_cuota_post_vencimiento: interesCuota,
                            monto_post_vencimiento: montoPostVencimiento
                        });
                        cuota = await this.cuotasDAO.createCuota({
                            monto,
                            cuota_programada_id: cuotaProgramada.dataValues.id,
                            tipo_de_cuota: tipoDeCuota,
                            categoria_id: categoriaId,
                            actividad_id: actividadId,
                            fecha_emision: `${mesesEnum[mesCuota]} ${añoCuota}`,
                            fecha_vencimiento: fechaVencimiento,
                            club_asociado_id: club.id
                        });
                        await this.asignarCuotaASocios(cuota, club);
                        await this.cronJobCuota(cuotaProgramada.dataValues.id);
                    }
                    else {
                        const cuotaProgramada = await this.cuotasDAO.programarCuota({
                            tipo_de_cuota: tipoDeCuota,
                            monto,
                            actividad_id: actividadId,
                            categoria_id: categoriaId,
                            abono_multiple: abonoMultiple,
                            maxima_cantidad_abono_multiple: maxCantAbonoMult,
                            club_asociado_id: club.id,
                            dia_de_vencimiento: diaDeVencimientoParam || 10,
                            actualiza_monto_cuando_vence: actualizaMontoCuandoVence || false,
                            frecuencia_interes: frecuenciaInteres,
                            interes_cuota_post_vencimiento: interesCuota,
                            monto_post_vencimiento: montoPostVencimiento
                        });
                        await this.cronJobCuota(cuotaProgramada.dataValues.id);
                    }
                }
                return cuota.dataValues.id;
            }
            else {
                const cuotaYaExistente = await this.cuotasDAO.findCuotaProgrmada(to, actividadId, categoriasId[0] || null, club.id);
                if (cuotaYaExistente)
                    throw new BadRequestError('La cuota que intenta crear ya esta programada');
                if (actividadId === 1) {
                    actividadId = undefined;
                }
                if (fechaEmisionMoment.isSameOrBefore(moment())) {
                    let fechaVencimiento;
                    if (mesCuota !== '2') {
                        fechaVencimiento = `30-${mesCuota}-${añoCuota}`;
                    }
                    else {
                        fechaVencimiento = `28-${mesCuota}-${añoCuota}`;
                    }
                    const cuotaProgramada = await this.cuotasDAO.programarCuota({
                        tipo_de_cuota: tipoDeCuota,
                        monto,
                        tipo_socio_id: to,
                        actividad_id: actividadId,
                        categoria_id: categoriasId[0] || null,
                        abono_multiple: abonoMultiple,
                        maxima_cantidad_abono_multiple: maxCantAbonoMult,
                        club_asociado_id: club.id,
                        dia_de_vencimiento: diaDeVencimientoParam || 10,
                        actualiza_monto_cuando_vence: actualizaMontoCuandoVence || false,
                        frecuencia_interes: frecuenciaInteres,
                        interes_cuota_post_vencimiento: interesCuota,
                        monto_post_vencimiento: montoPostVencimiento
                    });
                    const cuota = await this.cuotasDAO.createCuota({
                        monto,
                        cuota_programada_id: cuotaProgramada.dataValues.id,
                        fecha_emision: `${mesesEnum[mesCuota]} ${añoCuota}`,
                        tipo_de_cuota: cuotaProgramada.dataValues.tipo_de_cuota,
                        tipo_socio_id: to,
                        actividad_id: actividadId,
                        categoria_id: categoriasId[0],
                        fecha_vencimiento: fechaVencimiento,
                        club_asociado_id: club.id
                    });
                    await this.asignarCuotaASocios(cuota, club);
                    await this.cronJobCuota(cuotaProgramada.dataValues.id);
                    return cuota.dataValues.id;
                }
                else {
                    const cuotaProgramada = await this.cuotasDAO.programarCuota({
                        tipo_de_cuota: tipoDeCuota,
                        monto,
                        tipo_socio_id: to,
                        actividad_id: actividadId,
                        categoria_id: categoriasId[0] || null,
                        abono_multiple: abonoMultiple,
                        maxima_cantidad_abono_multiple: maxCantAbonoMult,
                        club_asociado_id: club.id,
                        dia_de_vencimiento: diaDeVencimientoParam || 10,
                        actualiza_monto_cuando_vence: actualizaMontoCuandoVence || false,
                        frecuencia_interes: frecuenciaInteres,
                        interes_cuota_post_vencimiento: interesCuota,
                        monto_post_vencimiento: montoPostVencimiento
                    });
                    await this.cronJobCuota(cuotaProgramada.dataValues.id);
                }
            }
        }
        catch (err) {
            console.log(err.message);
        }
    }
    async cronJobCuota(cuotaProgramadaId) {
        const job = cron.schedule('0 3 1 * *', async () => {
            try {
                const cuotaProgramada = await this.cuotasDAO.findCuotaProgramadaById(cuotaProgramadaId);
                let mesActual = new Date().getMonth() + 1;
                mesActual = mesActual < 10 ? `0${mesActual}` : mesActual.toString();
                let añoActual = new Date().getFullYear();
                const cuota = await this.cuotasDAO.createCuota({
                    monto: cuotaProgramada.dataValues.monto,
                    cuota_programada_id: cuotaProgramadaId,
                    tipo_de_cuota: cuotaProgramada.dataValues.tipo_de_cuota,
                    tipo_socio_id: cuotaProgramada.dataValues.tipo_socio_id,
                    actividad_id: cuotaProgramada.dataValues.actividad_id,
                    categoria_id: cuotaProgramada.dataValues.categoria_id,
                    fecha_emision: `${mesesEnum[mesActual]} ${añoActual}`,
                    fecha_vencimiento: `${cuotaProgramada.dataValues.dia_de_vencimiento}-${mesActual}-${añoActual}`,
                    club_asociado_id: cuotaProgramada.dataValues.club_asociado.dataValues.id
                });
                await this.asignarCuotaASocios(cuota, cuotaProgramada.dataValues.club_asociado.dataValues);
                if (cuotaProgramada.dataValues.categoria_id) {
                    if (!this.jobsMap.has(cuotaProgramada.dataValues.categoria_id)) {
                        this.jobsMap.set(`categoria${cuotaProgramada.dataValues.categoria_id}`, job);
                        logger.info(`cuota categoria creada`);
                    }
                }
                else if (cuotaProgramada.dataValues.tipo_socio_id) {
                    if (!this.jobsMap.has(cuotaProgramada.dataValues.tipo_socio_id)) {
                        this.jobsMap.set(`tiposocio${cuotaProgramada.dataValues.tipo_socio_id}`, job);
                        logger.info(`cuota tipo socio creada`);
                    }
                }
                else {
                    if (!this.jobsMap.has(cuotaProgramada.dataValues.actividad_id)) {
                        this.jobsMap.set(`actividad${cuotaProgramada.dataValues.actividad_id}`, job);
                    }
                }
                console.log(this.jobsMap);
                return job;
            }
            catch (error) {
                console.error('Error en el cron job:', error);
            }
        });
    }
    async actualizarCuotasVencidas() {
        cron.schedule('0 3 10-28 * *', async () => {
            const diaActual = new Date().getDate();
            const cuotasProgramadasConAcciones = await this.cuotasDAO.findAllCuotasProgramadasWithAcciones(diaActual);
            const mesActual = new Date().getMonth() + 1;
            for (const cuotaProgramadaConAcciones of cuotasProgramadasConAcciones) {
                if (parseInt(cuotaProgramadaConAcciones.dataValues.mes) - mesActual === 0) {
                    continue;
                }
                const idCuotaProgramada = cuotaProgramadaConAcciones.dataValues.id;
                const interesCuota = cuotaProgramadaConAcciones.interes_cuota_post_vencimiento;
                if (interesCuota) {
                    const montoCuotaProgramada = cuotaProgramadaConAcciones.dataValues.monto;
                    const montoDeInteres = montoCuotaProgramada * interesCuota / 100;
                    if (cuotaProgramadaConAcciones.dataValues.frecuencia_interes === 'diaria') {
                        //creacion de job diario
                        await this.cuotasDAO.actualizarMontoSocioCuotasVencidas(idCuotaProgramada, montoDeInteres, true);
                    }
                    else if (cuotaProgramadaConAcciones.dataValues.frecuencia_interes === 'semanal') {
                        //creacion de job semanal
                        await this.cuotasDAO.actualizarMontoSocioCuotasVencidas(idCuotaProgramada, montoDeInteres, true);
                    }
                    else {
                        //creacion de job mensual
                        await this.cuotasDAO.actualizarMontoSocioCuotasVencidas(idCuotaProgramada, montoDeInteres, true);
                    }
                }
                else {
                    const montoVencimiento = cuotaProgramadaConAcciones.dataValues.monto_post_vencimiento;
                    await this.cuotasDAO.actualizarMontoSocioCuotasVencidas(idCuotaProgramada, montoVencimiento, false);
                }
            }
        });
    }
    async getAllCuotas(clubAsociado) {
        //redis 
        return await this.cuotasDAO.getAllCuotas(clubAsociado);
    }
    async totalCuotasPendientes(socioId, clubAsociadoId) {
        return await this.cuotasDAO.totalCuotasPendientes(socioId, clubAsociadoId);
    }
    async getMisCuotasPendientes(socioId, clubAsociadoId) {
        return await this.cuotasDAO.getMisCuotasPendientes(socioId, clubAsociadoId);
    }
    async getAllCuotasSocio(socioId, clubAsociadoId) {
        return await this.cuotasDAO.getAllCuotasSocio(socioId, clubAsociadoId);
    }
    async pagarCuota(formaDePago, deuda, socioId, socioCuotaId, clubAsociado, tipoDeCuota, mesesAbonados) {
        let socioCuota = await this.cuotasDAO.getSocioCuota(socioCuotaId);
        const monto = socioCuota.dataValues.monto;
        if (tipoDeCuota !== 'cuota inscripcion') {
            const cuotaId = socioCuota.dataValues.cuota_id;
            await this.cuotasDAO.pagarCuota(formaDePago, socioId, socioCuotaId, clubAsociado);
            if (mesesAbonados > 1) {
                let socioIdString = String(socioId).slice(-4);
                let mesActual = new Date().getMonth() + 1;
                let añoActual = new Date().getFullYear();
                for (let i = 1; i < mesesAbonados; i++) {
                    let mes = mesActual + i;
                    if (mes > 12) {
                        mes = mes % 12;
                        if (mes === 0)
                            mes = 12;
                        añoActual = 2025;
                    }
                    mes = mes < 10 ? `0${mes}` : mes.toString();
                    let periodo = `${mesesEnum[mes]} ${añoActual}`;
                    await this.cuotasDAO.createSocioCuota({
                        id: parseInt(`${cuotaId}${i}${socioIdString}`),
                        forma_de_pago: formaDePago,
                        estado: 'PAGO',
                        fecha_pago: new Date(),
                        socio_id: socioId,
                        cuota_id: cuotaId,
                        monto,
                        periodo: periodo
                    });
                }
                if (tipoDeCuota === 'cuota social') {
                    await this.sociosApi.updateSocioMesesAbonadosCuotaSocial(mesesAbonados - 1, clubAsociado, socioId);
                }
                else {
                    const cuota = await this.cuotasDAO.findCuotaById(cuotaId);
                    const actividadId = cuota.dataValues.actividad_id;
                    await this.actividadesApi.updateSocioMesesAbonadosCuotaDeportiva(mesesAbonados - 1, socioId, actividadId, clubAsociado);
                }
            }
        }
        else {
            const inscripcion = await this.inscripcionesApi.getInscripcionById(socioCuota.dataValues.inscripcion_id, clubAsociado);
            await this.cuotasDAO.pagarCuota(formaDePago, socioId, socioCuotaId, clubAsociado);
            if (inscripcion.dataValues.actividad_id) {
                const transaccion = await this.transaccionesApi.getTransaccionSocioByMotivo(transaccionesEnum.inscripcionDeportiva, socioCuota.dataValues.socio_id, inscripcion.dataValues.actividad_id, null, clubAsociado);
                let categoriaId = null;
                if (transaccion.dataValues.detalles.includes('categoriaId')) {
                    await this.transaccionesApi.aprobarTransaccion(transaccion.dataValues.id, transaccionesEnum.inscripcionDeportiva, true, socioCuota.dataValues.socio_id, transaccion.dataValues.detalles, clubAsociado);
                    const detallesParsed = JSON.parse(transaccion.dataValues.detalles);
                    categoriaId = detallesParsed.categoriaId;
                }
                else {
                    await this.transaccionesApi.aprobarTransaccion(transaccion.dataValues.id, transaccionesEnum.inscripcionDeportiva, false, socioCuota.dataValues.socio_id, transaccion.dataValues.detalles, clubAsociado);
                }
                await this.asignarCuotaAUnSocio(socioId, null, inscripcion.dataValues.actividad_id, categoriaId, clubAsociado);
            }
            else {
                const transaccion = await this.transaccionesApi.getTransaccionSocioByMotivo(transaccionesEnum.inscripcionSocial, socioCuota.dataValues.socio_id, null, null, clubAsociado);
                await this.sociosDAO.cuotaInscripcionPaga(socioCuota.dataValues.socio_id, clubAsociado);
                await this.transaccionesApi.aprobarTransaccion(transaccion.dataValues.id, transaccionesEnum.inscripcionSocial, false, socioCuota.dataValues.socio_id, transaccion.dataValues.detalles, clubAsociado);
                await this.asignarCuotaAUnSocio(socioId, inscripcion.dataValues.tipo_socio_id, null, null, clubAsociado);
            }
        }
    }
    async getSocioCuota(id) {
        return await this.cuotasDAO.getSocioCuota(id);
    }
    async getCuota(id) {
        return await this.cuotasDAO.getCuota(id);
    }
    async getCuotasProgramadas(club) {
        return await this.cuotasDAO.getCuotasProgramadas(club);
    }
    async eliminarAllSocioCuotaByInscripcion(inscripcionId, clubAsociadoId) {
        return await this.cuotasDAO.eliminarAllSocioCuotaByInscripcion(inscripcionId, clubAsociadoId);
    }
    async eliminarCuotaProgramada(tipoDeSocioId, actividadId, categoriaId, club) {
        if (tipoDeSocioId) {
            console.log('job eliminado tiposocio');
            const job = this.jobsMap.get(`tiposocio${tipoDeSocioId}`);
            console.log(job);
            if (job) {
                job.stop();
                this.jobsMap.delete(`tiposocio${tipoDeSocioId}`);
            }
            return this.cuotasDAO.eliminarCuotaProgramada(club, tipoDeSocioId, actividadId, categoriaId);
        }
        else if (categoriaId) {
            console.log('job eliminado categoria');
            const job = this.jobsMap.get(`categoria${categoriaId}`);
            console.log(job);
            if (job) {
                job.stop();
                this.jobsMap.delete(`categoria${categoriaId}`);
            }
            return this.cuotasDAO.eliminarCuotaProgramada(club, tipoDeSocioId, actividadId, categoriaId);
        }
        else {
            const job = this.jobsMap.get(`actividad${actividadId}`);
            if (job) {
                job.stop();
                this.jobsMap.delete(`actividad${actividadId}`);
            }
            return this.cuotasDAO.eliminarCuotaProgramada(club, tipoDeSocioId, actividadId, categoriaId);
        }
    }
    async actualizarValorDeCuota(club, id, monto, diaDeVencimiento) {
        return await this.cuotasDAO.actualizarValorDeCuota(club, id, monto, diaDeVencimiento);
    }
    async getLast3CuotasPagas(socioId, clubAsociadoId) {
        return await this.cuotasDAO.getLast3CuotasPagas(socioId, clubAsociadoId);
    }
}
//# sourceMappingURL=cuotas.js.map