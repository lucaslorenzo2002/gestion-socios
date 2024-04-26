import debitoAutomaticoRouter from './router.js';
import adminAuth from '../middlewares/adminAuth.js';
import { DebitoAutomaticoController } from '../controllers/debitoAutomatico.js';
import auth from '../middlewares/auth.js';

export class DebitoAutomaticoRouter{
	controller: DebitoAutomaticoController;
	constructor(){
		this.controller = new DebitoAutomaticoController();
	}

	start(){
		debitoAutomaticoRouter.post('/habilitardebitoautomatico', adminAuth, this.controller.habilitarDebitoAutomatico);
		debitoAutomaticoRouter.get('/mediosdepagoendebitoautomatico', adminAuth, this.controller.getAllMediosDePagoInDebitoAutomatico);
		debitoAutomaticoRouter.get('/mediosdepagoendebitoautomaticosocio', auth, this.controller.getAllMediosDePagoInDebitoAutomatico);

		return debitoAutomaticoRouter;
	}
}