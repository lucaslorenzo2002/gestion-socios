import {SociosController} from '../controllers/socios.js';
import sociosRouter from './router.js';
import adminAuthMiddleware from '../middlewares/adminAuth.js';
import socioAuthMiddleware from '../middlewares/auth.js';
import auth from '../middlewares/auth.js';
import { crearSocioRequestValidation } from '../request-validation/socios.js'

export class SociosRouter{
	controller: SociosController;
	constructor(){
		this.controller = new SociosController();
	}

	start(){
		sociosRouter.post('/crearsocio', adminAuthMiddleware, crearSocioRequestValidation, this.controller.createSocio);
		sociosRouter.get('/socio/:id', adminAuthMiddleware, this.controller.getSocioById);
		sociosRouter.get('/sociobysocio', auth, this.controller.getSocioByIdSocio);
		sociosRouter.get('/dardebaja/:socioid', adminAuthMiddleware, this.controller.darDeBaja);
		sociosRouter.get('/dardealta/:socioid', adminAuthMiddleware, this.controller.darDeAlta);
		sociosRouter.get('/socios', adminAuthMiddleware, this.controller.getAllSocios);
		sociosRouter.get('/sociossintipo', adminAuthMiddleware, this.controller.getAllSociosSinTipoSocio);
		sociosRouter.get('/sociosentipo/:tiposocio', adminAuthMiddleware, this.controller.getAllSociosEnTipoSocio);
		sociosRouter.post('/actualizarsocio', socioAuthMiddleware, this.controller.updateSocioData);
		sociosRouter.get('/sociodeuda/:id', adminAuthMiddleware, this.controller.getSocioDeudaDesdeAdmin);
		sociosRouter.get('/sociodeuda', auth, this.controller.getSocioDeuda);
		//sociosRouter.post('/actualizarcategoria', adminAuthMiddleware, this.controller.actualizarCategoriaDeSocio);
		sociosRouter.post('/eliminarsociosdetipo/:tiposocioid', adminAuthMiddleware, this.controller.eliminarSocioDeTipoDeSocio);
		sociosRouter.post('/agrearsociosatipo/:tiposocioid', adminAuthMiddleware, this.controller.agregarSocioATipoDeSocio);
		//sociosRouter.post('/actualizaractividadessocio', adminAuthMiddleware, this.controller.actualizarActividadesSocio);
		sociosRouter.get('/sociosemail', adminAuthMiddleware, this.controller.getAllSociosWithEmail);
		sociosRouter.get('/sociossingrupofamiliar', adminAuthMiddleware, this.controller.getAllSociosSinGrupoFamiliar);
		sociosRouter.get('/familiaresengrupo/:grupofamiliarid', adminAuthMiddleware, this.controller.getAllFamiliaresEnGrupoFamiliar);
		sociosRouter.get('/familiaresengrupodesdesocio/:grupofamiliarid', auth, this.controller.getAllFamiliaresEnGrupoFamiliar);
		sociosRouter.get('/sociosendebitoautomatico', adminAuthMiddleware, this.controller.getAllSociosEnDebitoAutomatico);
		
		return sociosRouter;
	}
}
