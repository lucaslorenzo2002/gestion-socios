import {ActividadesController} from '../controllers/actividades.js';
import actividadesRouter from './router.js';
import adminAuth from '../middlewares/adminAuth.js';
import auth from '../middlewares/auth.js';

export class ActividadesRouter{
	controller: ActividadesController;
	constructor(){
		this.controller = new ActividadesController();
	}

	start(){
		actividadesRouter.post('/actividad', adminAuth, this.controller.createActividad);
		actividadesRouter.post('/asignarsociosaactividadycategoria/:actividadid/:categoriaid', adminAuth, this.controller.crearSocioActividadYCategoria);
		actividadesRouter.post('/eliminarsociosdeactividadycategoria/:actividadid/:categoriaid', adminAuth, this.controller.eliminarSocioActividadYCategoria);
		actividadesRouter.post('/asignarsociosaactividad/:actividadid', adminAuth, this.controller.crearSocioActividad);
		actividadesRouter.post('/eliminarsociosdeactividad/:actividadid', adminAuth, this.controller.eliminarSocioActividad);
		actividadesRouter.get('/sociosactividad/:actividadid', adminAuth, this.controller.getAllSociosEnActividad);
		actividadesRouter.get('/sociossinactividad/:actividadid', adminAuth, this.controller.getAllSociosSinActividad);
		actividadesRouter.get('/actividades', adminAuth, this.controller.getActividades);
		actividadesRouter.get('/actividadessocio', auth, this.controller.getSocioActividades);
		actividadesRouter.get('/actividadessociodesdeadmin/:socioid', adminAuth, this.controller.getSocioActividades);
		actividadesRouter.get('/eliminaractividad/:id', adminAuth, this.controller.eliminarActividad);

		return actividadesRouter;
	}
}