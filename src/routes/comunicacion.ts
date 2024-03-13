import {ComunicacionController} from '../controllers/comunicacion.js';
import comunicacionRouter from './router.js';
import {
	mailsIndividualizadosRequestValidation
} from '../request-validation/comunicacion.js'
import adminAuth from '../middlewares/adminAuth.js';

export class ComunicacionRouter{
    controller: ComunicacionController;
	constructor(){
		this.controller = new ComunicacionController();
	}

	start(){
		comunicacionRouter.post('/enviarmailsindividualizados', mailsIndividualizadosRequestValidation, adminAuth, this.controller.enviarMailsIndividualizados);
		comunicacionRouter.post('/enviarmailsmasivos', adminAuth, this.controller.enviarMailsMasivos);

		return comunicacionRouter;
	}
}