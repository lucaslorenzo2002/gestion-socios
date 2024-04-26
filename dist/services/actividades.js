import { ActividadesDAO } from '../database/actividades.js';
import { transaccionesEnum } from '../enums/transacciones.js';
import { BadRequestError } from '../errors/bad-request-error.js';
import { CategoriasSocioApi } from './categoriasSocio.js';
import { InscripcionesApi } from './inscripciones.js';
import { TransaccionesApi } from './transacciones.js';
import { CuotasDAO } from '../database/cuotas.js';
import { SociosApi } from './socios.js';
export class ActividadesApi {
    constructor() {
        this.actividadesDAO = new ActividadesDAO();
        this.categoriasApi = new CategoriasSocioApi();
        this.inscripcionesApi = new InscripcionesApi();
        this.transaccionesApi = new TransaccionesApi();
        this.cuotasDAO = new CuotasDAO();
        this.sociosApi = new SociosApi();
    }
    async createActividad(actividad, limiteDeJugadores, clubAsociadoId, categorias, poseeCategorias) {
        //no me genera el id automaticamente, entoces lo creo de forma aleatoria
        if (poseeCategorias && categorias.length === 0)
            throw new BadRequestError('Debe asignar al menos una categoria');
        if (!poseeCategorias && categorias.length > 0)
            throw new BadRequestError('Elimine las categorias creadas antes de seguir');
        const nuevaActividad = await this.actividadesDAO.crearActividad({
            actividad,
            club_asociado_id: clubAsociadoId,
            limite_de_jugadores: limiteDeJugadores,
            id: Math.floor(Math.random() * 100000) + 1,
            posee_categorias: poseeCategorias
        });
        if (categorias.length > 0) {
            for (const categoria of categorias) {
                await this.categoriasApi.createCategoriaSocio(categoria.categoria, clubAsociadoId, nuevaActividad.dataValues.id, categoria.limiteDeJugadores);
            }
        }
    }
    async getActividadById(id) {
        return await this.actividadesDAO.getActividadById(id);
    }
    async asignarInscripcionDeportivaConCategoria(sociosId, actividadId, categoriaId, clubAsociadoId) {
        const inscripcionProgramada = await this.inscripcionesApi.findInscripcionProgramada(null, actividadId, clubAsociadoId);
        const cantidadDeJugadoresCategoria = await this.categoriasApi.getCantidadDeJugadoresCategoriaById(categoriaId);
        const limiteDeJugadores = cantidadDeJugadoresCategoria.dataValues.limite_de_jugadores;
        let cantidadDeJugadoresCategoriaActualizada = cantidadDeJugadoresCategoria.dataValues.cantidad_de_jugadores + sociosId.length;
        if (limiteDeJugadores !== null && cantidadDeJugadoresCategoriaActualizada > limiteDeJugadores) {
            throw new BadRequestError('Excediste el limite de jugadores para la categoria');
        }
        if (inscripcionProgramada) {
            const sociosPendientes = await this.transaccionesApi.sociosWithTransaccionesPendientesCuotaInscripcion(null, actividadId, categoriaId, clubAsociadoId);
            if (limiteDeJugadores !== null && cantidadDeJugadoresCategoriaActualizada + sociosPendientes.length > limiteDeJugadores) {
                throw new BadRequestError('Excediste el limite de jugadores para la categoria');
            }
            const detalles = {
                detalle: 'Debe la cuota de inscripcion',
                actividadId,
                categoriaId
            };
            for (const socioId of sociosId) {
                await this.inscripcionesApi.cobrarInscripcionASocio(socioId, inscripcionProgramada.dataValues, clubAsociadoId);
                await this.transaccionesApi.iniciarTransaccion(socioId, transaccionesEnum.inscripcionDeportiva, JSON.stringify(detalles), clubAsociadoId);
            }
            return;
        }
        return await this.createSocioActividadYSocioCategoria(sociosId, actividadId, categoriaId, clubAsociadoId);
    }
    async asignarInscripcionDeportiva(sociosId, actividadId, clubAsociadoId) {
        const inscripcionProgramada = await this.inscripcionesApi.findInscripcionProgramada(null, actividadId, clubAsociadoId);
        const cantidadDeJugadoresActividad = await this.actividadesDAO.getCantidadDeJugadoresActividadById(actividadId);
        const limiteDeJugadores = cantidadDeJugadoresActividad.dataValues.limite_de_jugadores;
        let cantidadDeJugadoresActividadActualizada = cantidadDeJugadoresActividad.dataValues.cantidad_de_jugadores + sociosId.length;
        if (limiteDeJugadores !== null && cantidadDeJugadoresActividadActualizada > limiteDeJugadores) {
            throw new BadRequestError('Excediste el limite de jugadores para el deporte');
        }
        if (inscripcionProgramada) {
            const sociosPendientes = await this.transaccionesApi.sociosWithTransaccionesPendientesCuotaInscripcion(null, actividadId, null, clubAsociadoId);
            if (limiteDeJugadores !== null && cantidadDeJugadoresActividadActualizada + sociosPendientes.length > limiteDeJugadores) {
                throw new BadRequestError('Excediste el limite de jugadores para el deporte');
            }
            const detalles = {
                detalle: 'Debe la cuota de inscripcion',
                actividadId
            };
            for (const socioId of sociosId) {
                await this.inscripcionesApi.cobrarInscripcionASocio(socioId, inscripcionProgramada.dataValues, clubAsociadoId);
                await this.transaccionesApi.iniciarTransaccion(socioId, transaccionesEnum.inscripcionDeportiva, JSON.stringify(detalles), clubAsociadoId);
            }
            return;
        }
        return await this.createSocioActividad(sociosId, actividadId, clubAsociadoId);
    }
    async createSocioActividad(sociosId, actividadId, clubAsociadoId) {
        const cantidadDeJugadoresActividad = await this.actividadesDAO.getCantidadDeJugadoresActividadById(actividadId);
        let cantidadDeJugadoresActividadActualizada = cantidadDeJugadoresActividad.dataValues.cantidad_de_jugadores + sociosId.length;
        await this.actividadesDAO.actualizarActividadCantidadDeJugadores(cantidadDeJugadoresActividadActualizada, actividadId);
        for (const socioId of sociosId) {
            await this.actividadesDAO.crearSocioActividad({
                socio_id: socioId,
                actividad_id: actividadId,
                club_asociado_id: clubAsociadoId
            }, actividadId);
        }
    }
    async createSocioActividadYSocioCategoria(sociosId, actividadId, categoriaSocioId, clubAsociadoId) {
        const cantidadDeJugadoresCategoria = await this.categoriasApi.getCantidadDeJugadoresCategoriaById(categoriaSocioId);
        await this.categoriasApi.createCategoriaSocioSocio(sociosId, categoriaSocioId, clubAsociadoId, actividadId);
        await this.categoriasApi.actualizarCategoriaCantidadDeJugadores(cantidadDeJugadoresCategoria.dataValues.cantidad_de_jugadores + sociosId.length, categoriaSocioId);
        for (const socioId of sociosId) {
            await this.actividadesDAO.crearSocioActividad({
                socio_id: socioId,
                actividad_id: actividadId,
                categoria_socio_id: categoriaSocioId,
                club_asociado_id: clubAsociadoId
            }, actividadId);
        }
    }
    async eliminarSocioActividadYCategoria(sociosId, actividadId, club, categoriaSocioId) {
        const cantidadDeJugadoresCategoria = await this.categoriasApi.getCantidadDeJugadoresCategoriaById(categoriaSocioId);
        let cantidadDeJugadoresCategoriaActualizado = cantidadDeJugadoresCategoria.dataValues.cantidad_de_jugadores - sociosId.length;
        if (cantidadDeJugadoresCategoriaActualizado < 0) {
            cantidadDeJugadoresCategoriaActualizado = 0;
        }
        await this.categoriasApi.actualizarCategoriaCantidadDeJugadores(cantidadDeJugadoresCategoriaActualizado, categoriaSocioId);
        for (const socioId of sociosId) {
            await this.categoriasApi.eliminarCategoriaSocioSocio(socioId, categoriaSocioId, club);
            await this.actividadesDAO.eliminarSocioActividad(socioId, actividadId, club);
        }
    }
    async eliminarSocioActividad(sociosId, actividadId, clubAsociadoId) {
        const cantidadDeJugadoresActividad = await this.actividadesDAO.getCantidadDeJugadoresActividadById(actividadId);
        let cantidadDeJugadoresActividadActualizada = cantidadDeJugadoresActividad.dataValues.cantidad_de_jugadores - sociosId.length;
        await this.actividadesDAO.actualizarActividadCantidadDeJugadores(cantidadDeJugadoresActividadActualizada, actividadId);
        for (const socioId of sociosId) {
            await this.actividadesDAO.eliminarSocioActividad(socioId, actividadId, clubAsociadoId);
        }
    }
    async getAllSociosEnActividad(actividadId, clubAsociadoId) {
        const sociosEnActividad = await this.actividadesDAO.getAllSociosEnActividad(actividadId, clubAsociadoId);
        const sociosEnActividadDTO = [];
        for (const socioEnActividad of sociosEnActividad) {
            sociosEnActividadDTO.push(socioEnActividad.dataValues.Socio);
        }
        return sociosEnActividadDTO;
    }
    async getAllSociosSinActividad(actividadId, clubAsociadoId) {
        return await this.actividadesDAO.getAllSociosSinActividad(actividadId, clubAsociadoId);
    }
    async getActividades(clubAsociadoId) {
        const actividades = await this.actividadesDAO.getActividades(clubAsociadoId);
        let actividadesConCategoria = [];
        for (const actividad of actividades) {
            actividadesConCategoria.push({
                ...actividad.dataValues,
                categorias: await this.categoriasApi.getCategoriasActividad(clubAsociadoId, actividad.dataValues.id)
            });
        }
        return actividadesConCategoria;
    }
    async getSocioActividad(socioId) {
        return await this.actividadesDAO.getSocioActividad(socioId);
    }
    async eliminarActividad(id, clubAsociadoId) {
        const actividad = await this.getActividadById(id);
        if (actividad.dataValues.posee_cuota_inscripcion) {
            const inscripcion = await this.inscripcionesApi.findInscripcionProgramada(null, id, clubAsociadoId);
            await this.transaccionesApi.eliminarAllTransaccionesByMotivo(transaccionesEnum.inscripcionDeportiva, id, null, clubAsociadoId);
            await this.inscripcionesApi.eliminarCuotaInscripcion(inscripcion.dataValues.id, id, null, clubAsociadoId);
        }
        const cuotaProgramada = await this.cuotasDAO.findCuotaProgrmada(null, id, null, clubAsociadoId);
        if (cuotaProgramada) {
            await this.cuotasDAO.eliminarCuotaProgramada(clubAsociadoId, null, id, null);
        }
        await this.actividadesDAO.eliminarActividad(id, clubAsociadoId);
    }
    async getActividadSocio(socioId, actividadId, clubAsociadoId) {
        return await this.actividadesDAO.getActividadSocio(socioId, actividadId, clubAsociadoId);
    }
    async updateSocioMesesAbonadosCuotaDeportiva(mesesAbonados, socioId, actividadId, clubAsociado) {
        return await this.actividadesDAO.updateSocioMesesAbonadosCuotaDeportiva(mesesAbonados, socioId, actividadId, clubAsociado);
    }
}
//# sourceMappingURL=actividades.js.map