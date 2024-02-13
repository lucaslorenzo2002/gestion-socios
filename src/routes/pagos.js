const PagosController = require('../controllers/pagos');
const pagosRouter = require('./router');
const auth = require('../middlewares/auth');

class PagosRouter{
	constructor(){
		this.controller = new PagosController();
	}

	start(){
		pagosRouter.post('/crearorden/:sociocuotaid', auth, this.controller.crearOrden);
		pagosRouter.post('/webhook', this.controller.reciveWebhook);
		pagosRouter.get('/success', (req, res) => res.json({message: 'pago realizado'}));
		pagosRouter.get('/failure', (req, res) => res.json({message: 'error en el pago'}));
		
		return pagosRouter;
	}
}

module.exports = PagosRouter;