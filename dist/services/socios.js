import { SociosDAO } from '../database/socios.js';
import { uploadFile } from '../utils/awsS3.js';
export class SociosApi {
    constructor() {
        this.sociosDAO = new SociosDAO();
    }
    async createSocio(id, nombres, apellido, clubAsociado, fotoFile, fotoFileName, fotoUrl, socioDesde) {
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
        return await this.sociosDAO.getSocioDeuda(id);
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
    async updateSocioDeuda(deuda, socioId, clubAsociado) {
        return await this.sociosDAO.updateSocioDeuda(deuda, socioId, clubAsociado);
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
    async eliminarSocioDeTipoDeSocio(ids, tipoSocioId, clubAsociado) {
        for (const id of ids) {
            await this.sociosDAO.eliminarSocioDeTipoDeSocio(id, tipoSocioId, clubAsociado);
        }
    }
    async agregarSocioATipoDeSocio(ids, tipoSocioId, clubAsociado) {
        for (const id of ids) {
            await this.sociosDAO.agregarSocioATipoDeSocio(id, tipoSocioId, clubAsociado);
        }
    }
    async filterSocios(tipoSocio, categoria, actividades, club) {
        return await this.sociosDAO.filterSocios(tipoSocio, categoria, actividades, club);
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
    async getAllSociosWithEmailInActividadOrTipoSocio(actividadId, tipoSocio, clubAsociado) {
        return await this.sociosDAO.getAllSociosWithEmailInActividadOrTipoSocio(actividadId, tipoSocio, clubAsociado);
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
}
//# sourceMappingURL=socios.js.map