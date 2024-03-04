import { TipoSocio } from '../models/tipoSocio.js';
import logger from '../utils/logger.js';
import { SociosDAO } from './socios.js';
export class TipoSocioDAO {
    constructor() {
        this.sociosDAO = new SociosDAO();
    }
    async createTipoSocio(tipoSocio) {
        try {
            return await TipoSocio.create(tipoSocio);
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getTiposSocio(club) {
        try {
            return await TipoSocio.findAll({
                attributes: ['tipo_socio', 'id'],
                where: {
                    club_asociado_id: club
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
}
//# sourceMappingURL=tipoSocio.js.map