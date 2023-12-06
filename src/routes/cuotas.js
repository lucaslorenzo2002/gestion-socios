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
		cuotasRouter.get('/miscuotaspendientes', auth, this.controller.getMisCuotasPendientes);
		cuotasRouter.get('/miscuotaspagas', auth, this.controller.getMisCuotasPagas);
		cuotasRouter.get('/cuotassocio/:id', adminAuth, this.controller.getCuotasSocio);
		cuotasRouter.get('/cuotas', adminAuth, this.controller.getAllCuotas);
		cuotasRouter.post('/pagarcuota/:sociocuotaid', auth, this.controller.pagarCuota);
		cuotasRouter.get('/success', (req, res) => res.send('success'));
		cuotasRouter.get('/pending', (req, res) => res.send('pending'));
		cuotasRouter.get('/failure', (req, res) => res.send('failure'));

		return cuotasRouter;
	}
}

module.exports = CuotasRouter;