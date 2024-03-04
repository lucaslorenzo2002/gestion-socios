import { Administrador } from '../models/administrador.js';
import logger from '../utils/logger.js';
import { IncludeOptions } from './includeOptions.js';
export class AdministradoresDAO {
    constructor() {
        this.getAdminIncludeOptions = new IncludeOptions;
    }
    async findAdministradorByCodigo(codigoAdministrador) {
        try {
            return Administrador.findOne({
                include: this.getAdminIncludeOptions.getAdminIncludeOptions(),
                where: {
                    codigo_administrador: codigoAdministrador
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getAdministradorById(id) {
        try {
            return Administrador.findOne({
                include: this.getAdminIncludeOptions.getAdminIncludeOptions(),
                where: {
                    id
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getAdministradorByClubAsociado(clubAsociado) {
        try {
            return Administrador.findOne({
                include: this.getAdminIncludeOptions.getAdminIncludeOptions(),
                where: {
                    club_asociado_id: clubAsociado
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
}
//# sourceMappingURL=administradores.js.map