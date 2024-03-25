import { GruposFamiliaresDAO } from "../database/gruposFamiliares.js";
import { BadRequestError } from "../errors/bad-request-error.js";
import { SociosApi } from "./socios.js";
export class GruposFamiliaresApi {
    constructor() {
        this.gruposFamiliaresDAO = new GruposFamiliaresDAO();
        this.sociosApi = new SociosApi;
    }
    async crearGrupoFamiliar(apellidoTitular, sociosId, familiarTitularId, clubAsociadoId) {
        if (sociosId.length <= 1) {
            throw new BadRequestError('Los grupos familiares deben tener al menos 2 socios');
        }
        if (!familiarTitularId) {
            throw new BadRequestError('Debe especificar un titular de la familia');
        }
        const descuento = await this.gruposFamiliaresDAO.getDescuentoGrupoFamiliar(sociosId.length, clubAsociadoId);
        const grupoFamiliar = await this.gruposFamiliaresDAO.crearGrupoFamiliar(apellidoTitular, descuento.dataValues.id, sociosId.length, familiarTitularId, clubAsociadoId);
        for (const socioId of sociosId) {
            await this.sociosApi.asignarSocioAGrupoFamiliar(socioId, grupoFamiliar.dataValues.id, clubAsociadoId);
        }
    }
    async getGruposFamiliares(clubAsociadoId) {
        /* const cachedResponse = await client.get('gruposFamiliares');

        if(cachedResponse){
            return JSON.parse(cachedResponse);
        }
        
        const response = await this.gruposFamiliaresDAO.getGruposFamiliares(clubAsociadoId);

        await client.set('gruposFamiliares', JSON.stringify(response));
        
        return response */
        return await this.gruposFamiliaresDAO.getGruposFamiliares(clubAsociadoId);
    }
    async eliminarGrupoFamiliar(id, clubAsociadoId) {
        const familiaresEnGrupo = await this.sociosApi.getAllFamiliaresEnGrupoFamiliar(id, clubAsociadoId);
        for (let i = 0; i < familiaresEnGrupo.length; i++) {
            await this.sociosApi.eliminarSocioDeGrupoFamiliar(familiaresEnGrupo[i].dataValues.id, id, clubAsociadoId);
        }
        return await this.gruposFamiliaresDAO.eliminarGrupoFamiliar(id, clubAsociadoId);
    }
    async crearDescuentoGrupoFamiliar(descuentoCuota, cantidadDeFamiliares, clubAsociadoId) {
        const descuentoYaExistente = await this.gruposFamiliaresDAO.getDescuentoGrupoFamiliar(cantidadDeFamiliares, clubAsociadoId);
        if (descuentoYaExistente) {
            throw new BadRequestError(`Ya existe un descuento para los grupos familiares de ${cantidadDeFamiliares} personas`);
        }
        return await this.gruposFamiliaresDAO.crearDescuentoGrupoFamiliar(descuentoCuota, cantidadDeFamiliares, clubAsociadoId);
    }
    async getDescuentosGrupoFamiliar(clubAsociadoId) {
        /* const cachedResponse = await client.get('descuentosGruposFamiliares');

        if(cachedResponse){
            return JSON.parse(cachedResponse);
        }
        
        const response = await this.gruposFamiliaresDAO.getDescuentosGrupoFamiliar(clubAsociadoId);

        await client.set('descuentosGruposFamiliares', JSON.stringify(response));
        
        return response */
        return await this.gruposFamiliaresDAO.getDescuentosGrupoFamiliar(clubAsociadoId);
    }
    async actualizarTitularFamilia(familiarTitularId, id, clubAsociadoId) {
        return await this.gruposFamiliaresDAO.actualizarTitularFamilia(familiarTitularId, id, clubAsociadoId);
    }
}
//# sourceMappingURL=gruposFamiliares.js.map