import { GruposFamiliaresController } from '../controllers/gruposFamiliares.js';
import gruposFamiliaresRouter from './router.js';
import adminAuth from '../middlewares/adminAuth.js';
export class GruposFamiliaresRouter {
    constructor() {
        this.controller = new GruposFamiliaresController();
    }
    start() {
        gruposFamiliaresRouter.post('/grupofamiliar', adminAuth, this.controller.crearGrupoFamiliar);
        gruposFamiliaresRouter.get('/gruposfamiliares', adminAuth, this.controller.getGruposFamiliares);
        gruposFamiliaresRouter.get('/eliminargrupofamiliar/:grupofamiliarid', adminAuth, this.controller.eliminarGrupoFamiliar);
        gruposFamiliaresRouter.post('/descuentogrupofamiliar', adminAuth, this.controller.crearDescuentoGrupoFamiliar);
        gruposFamiliaresRouter.get('/descuentosgrupofamiliar', adminAuth, this.controller.getDescuentosGrupoFamiliar);
        gruposFamiliaresRouter.post('/actualizartitular/:id', adminAuth, this.controller.actualizarTitularFamilia);
        return gruposFamiliaresRouter;
    }
}
//# sourceMappingURL=gruposFamiliares.js.map