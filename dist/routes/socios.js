import { SociosController } from '../controllers/socios.js';
import sociosRouter from './router.js';
import adminAuthMiddleware from '../middlewares/adminAuth.js';
import socioAuthMiddleware from '../middlewares/auth.js';
import auth from '../middlewares/auth.js';
export class SociosRouter {
    constructor() {
        this.controller = new SociosController();
    }
    start() {
        sociosRouter.post('/crearsocio', adminAuthMiddleware, this.controller.createSocio);
        sociosRouter.get('/socio/:id', adminAuthMiddleware, this.controller.getSocioById);
        sociosRouter.get('/sociobysocio', auth, this.controller.getSocioByIdSocio);
        sociosRouter.get('/dardebaja/:socioid', adminAuthMiddleware, this.controller.darDeBaja);
        sociosRouter.get('/dardealta/:socioid', adminAuthMiddleware, this.controller.darDeAlta);
        sociosRouter.get('/socios', adminAuthMiddleware, this.controller.getAllSocios);
        sociosRouter.get('/sociossintipo', adminAuthMiddleware, this.controller.getAllSociosSinTipoSocio);
        sociosRouter.get('/sociosentipo/:tiposocio', adminAuthMiddleware, this.controller.getAllSociosEnTipoSocio);
        sociosRouter.post('/actualizarsocio', socioAuthMiddleware, this.controller.updateSocioData);
        sociosRouter.get('/sociodeuda/:id', adminAuthMiddleware, this.controller.getSocioDeuda);
        //sociosRouter.post('/actualizarcategoria', adminAuthMiddleware, this.controller.actualizarCategoriaDeSocio);
        sociosRouter.post('/eliminarsociosdetipo/:tiposocioid', adminAuthMiddleware, this.controller.eliminarSocioDeTipoDeSocio);
        sociosRouter.post('/agrearsociosatipo/:tiposocioid', adminAuthMiddleware, this.controller.agregarSocioATipoDeSocio);
        //sociosRouter.post('/actualizaractividadessocio', adminAuthMiddleware, this.controller.actualizarActividadesSocio);
        sociosRouter.post('/filtrarsocios', adminAuthMiddleware, this.controller.filterSocios);
        return sociosRouter;
    }
}
//# sourceMappingURL=socios.js.map