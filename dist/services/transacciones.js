import { ActividadesDAO } from '../database/actividades.js';
import { CategoriasSocioDAO } from '../database/categoriasSocio.js';
import { SociosDAO } from '../database/socios.js';
import { TransaccionesDAO } from '../database/transacciones.js';
import { transaccionesEnum } from '../enums/transacciones.js';
import { BadRequestError } from '../errors/bad-request-error.js';
export class TransaccionesApi {
    constructor() {
        this.transaccionesDAO = new TransaccionesDAO();
        this.sociosDAO = new SociosDAO();
        this.actividadesDAO = new ActividadesDAO();
        this.categoriasSocioDAO = new CategoriasSocioDAO();
    }
    async iniciarTransaccion(socioId, motivo, detalles, clubAsociadoId) {
        try {
            if (!motivo) {
                throw new BadRequestError('Sin motivo especificado');
            }
            if (!detalles) {
                throw new BadRequestError('Sin detalles especificados');
            }
            return await this.transaccionesDAO.iniciarTransaccion(socioId, motivo, detalles, clubAsociadoId);
        }
        catch (error) {
            console.log(error);
            throw new BadRequestError(error.BadRequestError);
        }
    }
    async aprobarTransaccion(id, motivo, poseeCategoria, socioId, detalles, clubAsociadoId) {
        if (motivo === transaccionesEnum.adherirseDebitoAutomatico) {
            await this.sociosDAO.adherirSocioAlDebitoAutomatico(socioId, clubAsociadoId);
            //llamada al servicio de pagos
        }
        if (motivo === transaccionesEnum.inscripcionSocial) {
            const detallesParsed = JSON.parse(detalles);
            await this.sociosDAO.agregarSocioATipoDeSocio(socioId, detallesParsed.tipoSocioId, clubAsociadoId);
        }
        if (motivo === transaccionesEnum.inscripcionDeportiva && poseeCategoria) {
            const detallesParsed = JSON.parse(detalles);
            await this.categoriasSocioDAO.createCategoriaSocioAndActividad({
                socio_id: socioId,
                actividad_id: detallesParsed.actividadId,
                categoria_socio_id: detallesParsed.categoriaId,
                club_asociado_id: clubAsociadoId
            }, {
                socio_id: socioId,
                actividad_id: detallesParsed.actividadId,
                club_asociado_id: clubAsociadoId
            }, detallesParsed.categoriaId);
        }
        if (motivo === transaccionesEnum.inscripcionDeportiva && !poseeCategoria) {
            const detallesParsed = JSON.parse(detalles);
            await this.actividadesDAO.crearSocioActividad({
                socio_id: socioId,
                actividad_id: detallesParsed.actividadId,
                club_asociado_id: clubAsociadoId
            }, detallesParsed.actividadId);
        }
        await this.transaccionesDAO.aprobarTransaccion(id, clubAsociadoId);
    }
    async rechazarTransaccion(id, clubAsociadoId) {
        return await this.transaccionesDAO.rechazarTransaccion(id, clubAsociadoId);
    }
    async getTransaccionesPendientesAdmin(clubAsociado) {
        return await this.transaccionesDAO.getTransaccionesPendientesAdmin(clubAsociado);
    }
    async getTransaccionesRealizadasAdmin(clubAsociado) {
        return await this.transaccionesDAO.getTransaccionesRealizadasAdmin(clubAsociado);
    }
    async getTransaccionesSocio(socioId, clubAsociadoId) {
        return await this.transaccionesDAO.getTransaccionesSocio(socioId, clubAsociadoId);
    }
    async getTransaccionSocioByMotivo(motivo, socioId, actividadId, categoriaId, clubAsociadoId) {
        return await this.transaccionesDAO.getTransaccionSocioByMotivo(motivo, socioId, actividadId, categoriaId, clubAsociadoId);
    }
    async getTransaccionById(id, clubAsociadoId) {
        const transaccion = await this.transaccionesDAO.getTransaccionById(id, clubAsociadoId);
        return {
            motivo: transaccion.dataValues.motivo,
            detalles: JSON.parse(transaccion.dataValues.detalles)
        };
    }
    async eliminarTransaccion(id) {
        return await this.transaccionesDAO.eliminarTransaccion(id);
    }
    async eliminarAllTransaccionesByMotivo(motivo, actividadId, categoriaId, clubAsociadoId) {
        return await this.transaccionesDAO.eliminarAllTransaccionesByMotivo(motivo, actividadId, categoriaId, clubAsociadoId);
    }
    async sociosWithTransaccionesPendientesCuotaInscripcion(tipoSocioId, actividadId, categoriaId, clubAsociadoId) {
        return await this.transaccionesDAO.sociosWithTransaccionesPendientesCuotaInscripcion(tipoSocioId, actividadId, categoriaId, clubAsociadoId);
    }
}
//# sourceMappingURL=transacciones.js.map