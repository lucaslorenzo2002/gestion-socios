const SociosController = require('../controllers/socios');
const sociosRouter = require('./router');
const adminAuthMiddleware = require('../middlewares/adminAuth');
const socioAuthMiddleware = require('../middlewares/auth');
const auth = require('../middlewares/auth');

class SociosRouter{
	constructor(){
		this.controller = new SociosController();
	}

	start(){
		sociosRouter.post('/crearsocio', adminAuthMiddleware, this.controller.createSocio);
		sociosRouter.get('/jugadores', adminAuthMiddleware, this.controller.getJugadores);
		sociosRouter.get('/socio/:id', adminAuthMiddleware, this.controller.getSocioById);
		sociosRouter.get('/sociobysocio', auth, this.controller.getSocioByIdSocio);
		sociosRouter.get('/dardebaja/:socioid', adminAuthMiddleware, this.controller.darDeBaja);
		sociosRouter.get('/dardealta/:socioid', adminAuthMiddleware, this.controller.darDeAlta);
		sociosRouter.get('/socios', adminAuthMiddleware, this.controller.getAllSocios);
		sociosRouter.post('/actualizarsocio', socioAuthMiddleware, this.controller.updateSocioData);
		sociosRouter.get('/sociodeuda/:id', adminAuthMiddleware, this.controller.getSocioDeuda);
		sociosRouter.post('/actualizarcategoria', adminAuthMiddleware, this.controller.actualizarCategoriaDeSocio);
		sociosRouter.post('/actualizartiposocio', adminAuthMiddleware, this.controller.actualizarTipoSocio);
		sociosRouter.post('/actualizaractividadessocio', adminAuthMiddleware, this.controller.actualizarActividadesSocio);
		sociosRouter.post('/filtrarsocios', adminAuthMiddleware, this.controller.filterSocios);
		
		return sociosRouter;
	}
}

module.exports = SociosRouter;