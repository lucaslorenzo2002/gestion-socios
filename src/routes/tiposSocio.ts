import {TiposSocioController} from '../controllers/tiposSocio.js';
import tiposSocioRouter from './router.js';
import adminAuth from '../middlewares/adminAuth.js';

export class TiposSocioRouter{
	controller: TiposSocioController;
	constructor(){
		this.controller = new TiposSocioController();
	}

	start(){
		tiposSocioRouter.post('/tiposocio', adminAuth, this.controller.createTipoSocio);
		tiposSocioRouter.get('/tiposocio', adminAuth, this.controller.getTiposSocio);
	
		return tiposSocioRouter;
	}
}