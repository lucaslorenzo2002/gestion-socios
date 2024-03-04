import { TipoSocioDAO } from '../database/tipoSocio.js';
import { SociosApi } from './socios.js';
export class TiposSocioApi {
    constructor() {
        this.tiposSocioDAO = new TipoSocioDAO();
        this.sociosApi = new SociosApi();
    }
    async createTipoSocio(tipoSocio, club) {
        return await this.tiposSocioDAO.createTipoSocio({ tipo_socio: tipoSocio, club });
    }
    async getTiposSocio(club) {
        const tiposSocioConCantidad = [];
        const tiposDeSocio = await this.tiposSocioDAO.getTiposSocio(club);
        for (const tipoDeSocio of tiposDeSocio) {
            tiposSocioConCantidad.push({
                ...tipoDeSocio.dataValues,
                cantidadDeSocios: (await this.sociosApi.getAllSociosEnTipoSocio(club, parseInt(tipoDeSocio.dataValues.id))).length
            });
        }
        return tiposSocioConCantidad;
    }
}
//# sourceMappingURL=tiposSocio.js.map