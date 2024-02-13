const CategoriasSocioController = require('../controllers/categoriasSocio');
const categoriasSocioRouter = require('./router');
const adminAuth = require('../middlewares/adminAuth');

class CategoriasSocioRouter{
	constructor(){
		this.controller = new CategoriasSocioController();
	}

	start(){
		categoriasSocioRouter.post('/categoriasocio', adminAuth, this.controller.createCategoriaSocio);
		categoriasSocioRouter.post('/getcategoriassocio', adminAuth, this.controller.getCategoriasActividad);
		categoriasSocioRouter.get('/categoriasocio', adminAuth, this.controller.getAllCategorias);
		categoriasSocioRouter.get('/categoriassocioconcuotascreadas', adminAuth, this.controller.categoriasDeSocioConCuotasCreadas);

		return categoriasSocioRouter;
	}
}

module.exports = CategoriasSocioRouter;