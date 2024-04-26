import { DebitoAutomatico } from '../models/debitoAutomatico.js';
import { MedioDePago_DebitoAutomatico } from '../models/medioDePago_debitoAutomatico.js';
import { MedioDePago } from '../models/mediosDePago.js';
import logger from '../utils/logger.js';
export class DebitoAutomaticoDAO {
    async habilitarDebitoAutomatico(clubAsociadoId, mediosDePago) {
        try {
            const debitoAutomatico = await DebitoAutomatico.create({
                club_asociado_id: clubAsociadoId
            });
            for (let i = 0; i < mediosDePago.length; i++) {
                await MedioDePago_DebitoAutomatico.create({
                    medio_de_pago_id: mediosDePago[i],
                    debito_automatico_id: debitoAutomatico.dataValues.id
                });
            }
        }
        catch (err) {
            logger.info(err);
        }
    }
    async getAllMediosDePagoInDebitoAutomatico(clubAsociadoId) {
        try {
            const debitoAutomaticoClub = await DebitoAutomatico.findOne({
                where: {
                    club_asociado_id: clubAsociadoId
                }
            });
            if (debitoAutomaticoClub) {
                return await MedioDePago_DebitoAutomatico.findAll({
                    include: [
                        {
                            model: MedioDePago
                        }
                    ],
                    where: {
                        debito_automatico_id: debitoAutomaticoClub.dataValues.id
                    }
                });
            }
            return [];
        }
        catch (err) {
            logger.info(err);
        }
    }
}
//# sourceMappingURL=debitoAutomatico.js.map