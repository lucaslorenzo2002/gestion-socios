const AuthController = require('../controllers/auth');
const authRouter = require('./router');

class AuthRouter{
	constructor(){
		this.controller = new AuthController();
	}

	start(){
		authRouter.post('/register', this.controller.completeSocioRegister);
		authRouter.get('/confirmaremail/:token', this.controller.validateUser);
		authRouter.post('/login', this.controller.login);
		authRouter.post('/loginadmin', this.controller.loginAdmin);
		authRouter.get('/logout', this.controller.logout);
		//authRouter.post('/resetpasswordrequest', this.controller.resetPasswordRequest);
		//authRouter.post('/resetpassword/:token', this.controller.resetPassword);
		
		return authRouter;
	}
}

module.exports = AuthRouter;