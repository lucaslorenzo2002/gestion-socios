import { AdministradoresDAO } from '../database/administradores.js';
export class AdministradoresApi {
    constructor() {
        this.administradoresDAO = new AdministradoresDAO();
    }
    async logInAdministrador(codigoAdministrador) {
        const administrador = await this.administradoresDAO.findAdministradorByCodigo(codigoAdministrador);
        if (!administrador) {
            return { success: false, message: 'codigo incorrecto' };
        }
        return { success: true, admin: { id: administrador.dataValues.id, clubAsociado: administrador.dataValues.club_asociado }, message: 'sesion iniciada' };
    }
    async getAdministradorByClubAsociado(clubAsociado) {
        return await this.administradoresDAO.getAdministradorByClubAsociado(clubAsociado);
    }
}
//# sourceMappingURL=administradores.js.map