const SociosController = require('../controllers/socios');
const sociosRouter = require('./router');
const adminAuthMiddleware = require('../middlewares/adminAuth');
const socioAuthMiddleware = require('../middlewares/auth');

class SociosRouter{
	constructor(){
		this.controller = new SociosController();
	}

	start(){
		sociosRouter.post('/crearsocio', adminAuthMiddleware, this.controller.createSocio);
		sociosRouter.get('/jugadores', adminAuthMiddleware, this.controller.getJugadores);
		sociosRouter.get('/socio', adminAuthMiddleware, this.controller.getSocioById);
		sociosRouter.get('/dardebaja/:socioid', adminAuthMiddleware, this.controller.darDeBaja);
		sociosRouter.post('/actualizarsocio', socioAuthMiddleware, this.controller.updateSocioData);
		
		return sociosRouter;
	}
}

module.exports = SociosRouter;