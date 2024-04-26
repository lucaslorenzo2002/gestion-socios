import { AuthController } from '../controllers/auth.js';
import authRouter from './router.js';
import { registerRequestValidation, resetPasswordRequestValidation, resetPasswordReqRequestValidation } from '../request-validation/auth.js';
export class AuthRouter {
    constructor() {
        this.controller = new AuthController();
    }
    start() {
        authRouter.post('/register', registerRequestValidation, this.controller.completeSocioRegister);
        authRouter.get('/confirmaremail/:token', this.controller.validateUser);
        authRouter.post('/login', this.controller.login);
        authRouter.post('/loginadmin', this.controller.loginAdmin);
        authRouter.get('/logout', this.controller.logout);
        authRouter.post('/resetpasswordrequest', resetPasswordReqRequestValidation, this.controller.resetPasswordRequest);
        authRouter.get('/resetpassword/:token', this.controller.resetPasswordUI);
        authRouter.post('/resetpassword/:token', resetPasswordRequestValidation, this.controller.resetPassword);
        authRouter.post('/crearadministradortest', this.controller.crearAdministradorTest);
        authRouter.post('/crearclubtest', this.controller.crearClubTest);
        return authRouter;
    }
}
//# sourceMappingURL=auth.js.map