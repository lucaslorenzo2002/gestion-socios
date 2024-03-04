import {PagosController} from '../controllers/pagos.js';
import pagosRouter from './router.js';
import auth from '../middlewares/auth.js';

export class PagosRouter{
	controller: PagosController;
	constructor(){
		this.controller = new PagosController();
	}

	start(){
		pagosRouter.post('/crearorden', auth, this.controller.crearOrden);
		pagosRouter.post('/webhook', this.controller.reciveWebhook);
		pagosRouter.get('/success', (req, res) => res.json({message: 'pago realizado'}));
		pagosRouter.get('/failure', (req, res) => res.json({message: 'error en el pago'}));
		
		return pagosRouter;
	}
}
