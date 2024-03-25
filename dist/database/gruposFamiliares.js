import { Descuento_grupo_familiar } from '../models/descuento_grupo_familiar.js';
import { Grupo_familiar } from '../models/grupo_familiar.js';
import logger from '../utils/logger.js';
export class GruposFamiliaresDAO {
    async crearGrupoFamiliar(apellidoTitular, descuentoId, cantidadDeFamiliares, familiarTitularId, clubAsociadoId) {
        try {
            return await Grupo_familiar.create({
                apellido_titular: apellidoTitular,
                descuento_id: descuentoId,
                cantidad_de_familiares: cantidadDeFamiliares,
                familiar_titular_id: familiarTitularId,
                club_asociado_id: clubAsociadoId
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getGruposFamiliares(clubAsociadoId) {
        try {
            return await Grupo_familiar.findAll({
                include: [
                    {
                        model: Descuento_grupo_familiar,
                        attributes: ['descuento_cuota']
                    }
                ],
                where: {
                    club_asociado_id: clubAsociadoId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async eliminarGrupoFamiliar(id, clubAsociadoId) {
        try {
            return await Grupo_familiar.destroy({
                where: {
                    id,
                    club_asociado_id: clubAsociadoId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async crearDescuentoGrupoFamiliar(descuentoCuota, cantidadDeFamiliares, clubAsociadoId) {
        try {
            return await Descuento_grupo_familiar.create({
                descuento_cuota: descuentoCuota,
                cantidad_de_familiares: cantidadDeFamiliares,
                club_asociado_id: clubAsociadoId
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getDescuentoGrupoFamiliar(cantidadDeFamiliares, clubAsociadoId) {
        try {
            return await Descuento_grupo_familiar.findOne({
                where: {
                    cantidad_de_familiares: cantidadDeFamiliares,
                    club_asociado_id: clubAsociadoId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getDescuentosGrupoFamiliar(clubAsociadoId) {
        try {
            return await Descuento_grupo_familiar.findAll({
                where: {
                    club_asociado_id: clubAsociadoId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async actualizarTitularFamilia(familiarTitularId, id, clubAsociadoId) {
        try {
            return await Grupo_familiar.update({ familiar_titular_id: familiarTitularId }, {
                where: {
                    id,
                    club_asociado_id: clubAsociadoId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
}
//# sourceMappingURL=gruposFamiliares.js.map