import { MedioDePago } from '../models/mediosDePago.js';
import logger from '../utils/logger.js';
export class MediosDePagoDAO {
    async getAllMediosDePago() {
        try {
            return await MedioDePago.findAll();
        }
        catch (err) {
            logger.info(err);
        }
    }
}
//# sourceMappingURL=mediosDePago.js.map