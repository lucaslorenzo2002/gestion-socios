const PagosController = require('../controllers/pagos');
const pagosRouter = require('./router');
const auth = require('../middlewares/auth');

class PagosRouter{
	constructor(){
		this.controller = new PagosController();
	}

	start(){
		pagosRouter.get('/crearorden/:sociocuotaid', auth, this.controller.crearOrden);
		pagosRouter.post('/webhook', this.controller.reciveWebhook);
		
		return pagosRouter;
	}
}

module.exports = PagosRouter;