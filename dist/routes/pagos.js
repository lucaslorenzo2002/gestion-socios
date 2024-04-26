import { PagosController } from '../controllers/pagos.js';
import pagosRouter from './router.js';
import auth from '../middlewares/auth.js';
import adminAuth from '../middlewares/adminAuth.js';
export class PagosRouter {
    constructor() {
        this.controller = new PagosController();
    }
    start() {
        pagosRouter.post('/crearorden', auth, this.controller.crearOrden);
        pagosRouter.post('/crearsuscripcion', adminAuth, this.controller.aprobarDebitoAutomatico);
        pagosRouter.post('/crearcliente', adminAuth, this.controller.crearCliente);
        pagosRouter.post('/webhook', this.controller.reciveWebhook);
        pagosRouter.get('/success', (req, res) => res.json({ message: 'pago realizado' }));
        pagosRouter.get('/failure', (req, res) => res.json({ message: 'error en el pago' }));
        return pagosRouter;
    }
}
//# sourceMappingURL=pagos.js.map