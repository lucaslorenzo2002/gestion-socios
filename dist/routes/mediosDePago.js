import mediosDePagoRouter from './router.js';
import adminAuth from '../middlewares/adminAuth.js';
import { MediosDePagoController } from '../controllers/mediosDePago.js';
export class MediosDePagoRouter {
    constructor() {
        this.controller = new MediosDePagoController();
    }
    start() {
        mediosDePagoRouter.get('/mediosdepago', adminAuth, this.controller.getAllMediosDePago);
        return mediosDePagoRouter;
    }
}
//# sourceMappingURL=mediosDePago.js.map