import { CuotasDAO } from '../database/cuotas.js';
import { SociosDAO } from '../database/socios.js';
import { transaccionesEnum } from '../enums/transacciones.js';
import { BadRequestError } from '../errors/bad-request-error.js';
import { uploadFile } from '../utils/awsS3.js';
import { InscripcionesApi } from './inscripciones.js';
import { TransaccionesApi } from './transacciones.js';
export class SociosApi {
    constructor() {
        this.sociosDAO = new SociosDAO();
        this.inscripcionesApi = new InscripcionesApi();
        this.transaccionesApi = new TransaccionesApi();
        this.cuotasDAO = new CuotasDAO();
    }
    async createSocio(id, nombres, apellido, clubAsociado, fotoFile, fotoFileName, fotoUrl, socioDesde) {
        const socio = await this.sociosDAO.getSocioById(id);
        if (socio) {
            throw new BadRequestError('El dni ya ha sido registrado');
        }
        if (fotoFile && fotoFileName && fotoUrl) {
            await uploadFile(fotoFile, fotoFileName);
        }
        await this.sociosDAO.createSocio({
            id,
            nombres,
            apellido,
            club_asociado_id: clubAsociado,
            foto_de_perfil: fotoUrl,
            socio_desde: socioDesde
        });
    }
    async getSocioById(id) {
        return await this.sociosDAO.getSocioById(id);
    }
    async getSocioDeuda(id) {
        return await this.sociosDAO.getDeudaSocio(id);
    }
    async getAllSocios(clubAsociado) {
        return await this.sociosDAO.getAllSocios(clubAsociado);
    }
    async getAllSociosSinTipoSocio(clubAsociado) {
        return await this.sociosDAO.getAllSociosSinTipoSocio(clubAsociado);
    }
    async getAllSociosEnTipoSocio(clubAsociado, tipoSocio) {
        return await this.sociosDAO.getAllSociosEnTipoSocio(clubAsociado, tipoSocio);
    }
    async darDeBaja(id) {
        return await this.sociosDAO.darDeBaja(id);
    }
    async darDeAlta(id) {
        return await this.sociosDAO.darDeAlta(id);
    }
    async updateSocioData(fecNacimiento, edad, telefonoCelular, codigoPostal, direccion, ciudad, provincia, poseeObraSocial, siglas, rnos, numeroDeAfiliados, denominacionDeObraSocial, id) {
        const bodyArray = [fecNacimiento, edad, telefonoCelular, codigoPostal, direccion, ciudad, provincia, poseeObraSocial, siglas, rnos, numeroDeAfiliados, denominacionDeObraSocial];
        let camposCompletados = 0;
        for (const campo of bodyArray) {
            if (campo !== null) {
                camposCompletados++;
            }
        }
        let porcentajeCamposCompletados;
        if (poseeObraSocial) {
            porcentajeCamposCompletados = camposCompletados * 100 / 19;
        }
        else {
            porcentajeCamposCompletados = (camposCompletados - 4) * 100 / 15;
        }
        return await this.sociosDAO.updateSocioData(fecNacimiento, edad, telefonoCelular, codigoPostal, direccion, ciudad, provincia, poseeObraSocial, siglas, rnos, numeroDeAfiliados, denominacionDeObraSocial, Math.floor(42 + porcentajeCamposCompletados) > 100 ? 100 : Math.floor(42 + porcentajeCamposCompletados), id);
    }
    async eliminarSocioDeTipoDeSocio(ids, tipoSocioId, clubAsociadoId) {
        const inscripcionProgramada = await this.inscripcionesApi.findInscripcionProgramada(tipoSocioId, null, clubAsociadoId);
        if (inscripcionProgramada) {
            for (const id of ids) {
                await this.sociosDAO.sinCuotaInscripcion(id, clubAsociadoId);
            }
        }
        for (const id of ids) {
            await this.sociosDAO.eliminarSocioDeTipoDeSocio(id, tipoSocioId, clubAsociadoId);
        }
    }
    async asignarInscripcionSocial(ids, tipoSocioId, clubAsociadoId) {
        const inscripcionProgramada = await this.inscripcionesApi.findInscripcionProgramada(tipoSocioId, null, clubAsociadoId);
        if (inscripcionProgramada) {
            const detalles = {
                detalle: 'Debe la cuota de inscripcion',
                tipoSocioId
            };
            for (const id of ids) {
                await this.sociosDAO.cuotaInscripcionPendiente(id, clubAsociadoId);
                await this.inscripcionesApi.cobrarInscripcionASocio(id, inscripcionProgramada.dataValues, clubAsociadoId);
                await this.transaccionesApi.iniciarTransaccion(id, transaccionesEnum.inscripcionSocial, JSON.stringify(detalles), clubAsociadoId);
            }
            return;
        }
        return await this.agregarSocioATipoDeSocio(ids, tipoSocioId, clubAsociadoId);
    }
    async agregarSocioATipoDeSocio(ids, tipoSocioId, clubAsociadoId) {
        for (const id of ids) {
            await this.sociosDAO.agregarSocioATipoDeSocio(id, tipoSocioId, clubAsociadoId);
        }
    }
    async eliminarSociosDePendiente(ids, tipoSocioId, actividadId, categoriaId, clubAsociadoId) {
        try {
            for (const id of ids) {
                let transaccion;
                if (tipoSocioId) {
                    transaccion = await this.transaccionesApi.getTransaccionSocioByMotivo(transaccionesEnum.inscripcionSocial, id, null, null, clubAsociadoId);
                    await this.sociosDAO.sinCuotaInscripcion(id, clubAsociadoId);
                }
                else {
                    transaccion = await this.transaccionesApi.getTransaccionSocioByMotivo(transaccionesEnum.inscripcionDeportiva, id, actividadId, categoriaId, clubAsociadoId);
                }
                await this.transaccionesApi.eliminarTransaccion(transaccion.dataValues.id);
                const inscripcion = await this.inscripcionesApi.findInscripcionProgramada(tipoSocioId, actividadId, clubAsociadoId);
                const socioCuota = await this.cuotasDAO.getSocioCuotaInscripcion(inscripcion.dataValues.id, id);
                await this.cuotasDAO.eliminarSocioCuota(socioCuota.dataValues.id);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    async filterSociosCuotaByActividad(actividad, categoria, club) {
        return await this.sociosDAO.filterSociosCuotaByActividad(actividad, categoria, club);
    }
    async filterSociosCuotaByTipoSocio(tipoSocio, club) {
        return await this.sociosDAO.filterSociosCuotaByTipoSocio(tipoSocio, club);
    }
    async updateSocioMesesAbonadosCuotaSocial(mesesAbonados, clubAsociado, socioId) {
        return await this.sociosDAO.updateSocioMesesAbonadosCuotaSocial(mesesAbonados, clubAsociado, socioId);
    }
    async getAllSociosWithEmail(clubAsociado) {
        return await this.sociosDAO.getAllSociosWithEmail(clubAsociado);
    }
    async getAllSociosWithEmailInActividadOrTipoSocio(actividadId, tipoSocio, categoriasId, clubAsociado) {
        return await this.sociosDAO.getAllSociosWithEmailInActividadOrTipoSocio(actividadId, tipoSocio, categoriasId, clubAsociado);
    }
    async asignarSocioAGrupoFamiliar(socioId, grupoFamiliarId, clubAsociadoId) {
        return await this.sociosDAO.asignarSocioAGrupoFamiliar(socioId, grupoFamiliarId, clubAsociadoId);
    }
    async eliminarSocioDeGrupoFamiliar(id, grupoFamiliarId, clubAsociadoId) {
        return await this.sociosDAO.eliminarSocioDeGrupoFamiliar(id, grupoFamiliarId, clubAsociadoId);
    }
    async getAllSociosSinGrupoFamiliar(clubAsociadoId) {
        return await this.sociosDAO.getSociosSinGrupoFamiliar(clubAsociadoId);
    }
    async getAllFamiliaresEnGrupoFamiliar(grupoFamiliarId, clubAsociadoId) {
        return await this.sociosDAO.getAllFamiliaresEnGrupoFamiliar(grupoFamiliarId, clubAsociadoId);
    }
    async adherirSocioAlDebitoAutomatico(id, clubAsociadoId) {
        return await this.sociosDAO.adherirSocioAlDebitoAutomatico(id, clubAsociadoId);
    }
    async getAllSociosEnDebitoAutomatico(clubAsociadoId) {
        return await this.sociosDAO.getAllSociosEnDebitoAutomatico(clubAsociadoId);
    }
}
//# sourceMappingURL=socios.js.map