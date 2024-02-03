const CategoriasSocioController = require('../controllers/categoriasSocio');
const categoriasSocioRouter = require('./router');
const adminAuth = require('../middlewares/adminAuth');

class CategoriasSocioRouter{
	constructor(){
		this.controller = new CategoriasSocioController();
	}

	start(){
		categoriasSocioRouter.post('/categoriasocio', adminAuth, this.controller.createCategoriaSocio);
		categoriasSocioRouter.get('/categoriasocio', adminAuth, this.controller.getCategoriasSocio);
		categoriasSocioRouter.get('/categoriassocioconcuotascreadas', adminAuth, this.controller.categoriasDeSocioConCuotasCreadas);

		return categoriasSocioRouter;
	}
}

module.exports = CategoriasSocioRouter;