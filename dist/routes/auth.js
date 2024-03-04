import { AuthController } from '../controllers/auth.js';
import authRouter from './router.js';
export class AuthRouter {
    constructor() {
        this.controller = new AuthController();
    }
    start() {
        authRouter.post('/register', this.controller.completeSocioRegister);
        authRouter.get('/confirmaremail/:token', this.controller.validateUser);
        authRouter.post('/login', this.controller.login);
        authRouter.post('/loginadmin', this.controller.loginAdmin);
        authRouter.get('/logout', this.controller.logout);
        authRouter.post('/resetpasswordrequest', this.controller.resetPasswordRequest);
        authRouter.get('/resetpassword/:token', this.controller.resetPasswordUI);
        authRouter.post('/resetpassword/:token', this.controller.resetPassword);
        return authRouter;
    }
}
//# sourceMappingURL=auth.js.map