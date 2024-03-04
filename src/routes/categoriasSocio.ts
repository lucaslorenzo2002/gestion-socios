import {CategoriasSocioController} from '../controllers/categoriasSocio.js';
import categoriasSocioRouter from './router.js';
import adminAuth from '../middlewares/adminAuth.js';

export class CategoriasSocioRouter{
	controller: CategoriasSocioController;
	constructor(){
		this.controller = new CategoriasSocioController();
	}

	start(){
		categoriasSocioRouter.post('/categoriasocio/:actividadid', adminAuth, this.controller.createCategoriaSocio);
		categoriasSocioRouter.get('/categoriasactividad/:actividadid', adminAuth, this.controller.getCategoriasActividad);
		categoriasSocioRouter.get('/socioscategoria/:actividadid/:categoriaid', adminAuth, this.controller.getAllSociosEnCategoria);
		//categoriasSocioRouter.post('/asignarsocioacategoria/:actividadid/:categoriaid', adminAuth, this.controller.getAllSociosEnCategoria);
		//categoriasSocioRouter.post('/eliminarsociodecategoria/:actividadid/:categoriaid', adminAuth, this.controller.getAllSociosEnCategoria);
		categoriasSocioRouter.get('/categoriasocio', adminAuth, this.controller.getAllCategorias);
		categoriasSocioRouter.get('/eliminarcategoria/:id/:actividadid', adminAuth, this.controller.eliminarCategoria);

		return categoriasSocioRouter;
	}
}
