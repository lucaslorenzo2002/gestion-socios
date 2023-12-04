const CuotasController = require('../controllers/cuotas');
const cuotasRouter = require('./router');
const adminAuth = require('../middlewares/adminAuth');
const auth = require('../middlewares/auth');

class CuotasRouter{
	constructor(){
		this.controller = new CuotasController();
	}

	start(){
		cuotasRouter.post('/crearcuota', adminAuth, this.controller.createCuota);
		cuotasRouter.get('/miscuotas', auth, this.controller.getMisCuotas);
		cuotasRouter.get('/cuotassocio/:id', adminAuth, this.controller.getCuotasSocio);
		cuotasRouter.get('/cuotas', adminAuth, this.controller.getAllCuotas);
		cuotasRouter.post('/pagarcuota/:sociocuotaid', auth, this.controller.pagarCuota);
		
		return cuotasRouter;
	}
}

module.exports = CuotasRouter;