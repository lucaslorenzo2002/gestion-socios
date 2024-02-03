const TiposSocioController = require('../controllers/tiposSocio');
const tiposSocioRouter = require('./router');
const adminAuth = require('../middlewares/adminAuth');

class TiposSocioRouter{
	constructor(){
		this.controller = new TiposSocioController();
	}

	start(){
		tiposSocioRouter.post('/tiposocio', adminAuth, this.controller.createTipoSocio);
		tiposSocioRouter.get('/tiposocio', adminAuth, this.controller.getTiposSocio);
	
		return tiposSocioRouter;
	}
}

module.exports = TiposSocioRouter;