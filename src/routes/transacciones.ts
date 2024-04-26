import {TransaccionesController} from '../controllers/transacciones.js';
import transaccionesRouter from './router.js';
import adminAuth from '../middlewares/adminAuth.js';
import auth from '../middlewares/auth.js';

export class TransaccionesRouter{
	controller: TransaccionesController;
	constructor(){
		this.controller = new TransaccionesController();
	}

	start(){
		transaccionesRouter.post('/iniciartransaccion', auth, this.controller.iniciarTransaccion);
		transaccionesRouter.get('/transaccionespendientesadmin', adminAuth, this.controller.getTransaccionesPendientesAdmin);
		transaccionesRouter.get('/transaccionesrealizadasadmin', adminAuth, this.controller.getTransaccionesRealizadasAdmin);
		transaccionesRouter.get('/transaccionessocio', auth, this.controller.getTransaccionesSocio);
		transaccionesRouter.get('/transaccionsociobymotivo/:motivo/:actividadid/:categoriaid', auth, this.controller.getTransaccionSocioByMotivo);
		transaccionesRouter.get('/transaccionbyid/:id', adminAuth, this.controller.getTransaccionById);
		transaccionesRouter.post('/aprobartransaccion/:id', adminAuth, this.controller.aprobarTransaccion);
		transaccionesRouter.get('/rechazartransaccion/:id', adminAuth, this.controller.rechazarTransaccion);
		transaccionesRouter.get('/sociospendientesinscripcion/:tiposocioid/:actividadid/:categoriaid', adminAuth, this.controller.sociosWithTransaccionesPendientesCuotaInscripcion);
		transaccionesRouter.post('/eliminarpendientesinscripcion', adminAuth, this.controller.eliminarTransaccionesPendientesCuotaInscripcion);

		return transaccionesRouter;
	}
}
