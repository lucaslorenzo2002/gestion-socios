const ActividadesController = require('../controllers/actividades');
const actividadesRouter = require('./router');
const adminAuth = require('../middlewares/adminAuth');
const auth = require('../middlewares/auth');

class ActividadesRouter{
	constructor(){
		this.controller = new ActividadesController();
	}

	start(){
		actividadesRouter.post('/actividad', adminAuth, this.controller.createActividad);
		actividadesRouter.get('/actividades', adminAuth, this.controller.getActividades);
		actividadesRouter.get('/actividadessocio', auth, this.controller.getSocioActividades);
		actividadesRouter.get('/eliminaractividad/:id', adminAuth, this.controller.eliminarActividad);

		return actividadesRouter;
	}
}

module.exports = ActividadesRouter;