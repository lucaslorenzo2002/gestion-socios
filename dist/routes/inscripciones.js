import inscripcionesRouter from './router.js';
import adminAuth from '../middlewares/adminAuth.js';
import { InscripcionesController } from '../controllers/inscripciones.js';
export class InscripcionesRouter {
    constructor() {
        this.controller = new InscripcionesController();
    }
    start() {
        inscripcionesRouter.post('/programarinscripcion', adminAuth, this.controller.programarInscripcion);
        inscripcionesRouter.get('/cuotasinscripcion', adminAuth, this.controller.getAllCuotasInscripcion);
        inscripcionesRouter.get('/cuotainscripcion/:tiposocioid/:actividadid/:categoriaid', adminAuth, this.controller.findInscripcionProgramada);
        inscripcionesRouter.post('/actualizarvalorcuotainscripcion/:id', adminAuth, this.controller.actualizarValorCuotaInscripcion);
        inscripcionesRouter.get('/eliminarcuotainscripcion/:id/:tiposocioid/:actividadid', adminAuth, this.controller.eliminarCuotaInscripcion);
        return inscripcionesRouter;
    }
}
//# sourceMappingURL=inscripciones.js.map