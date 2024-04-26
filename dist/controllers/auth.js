import asyncHandler from 'express-async-handler';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { AuthApi } from '../services/auth.js';
import { SociosApi } from '../services/socios.js';
import { AdministradoresApi } from '../services/administradores.js';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error.js';
import { AdministradoresDAO } from '../database/administradores.js';
import { BadRequestError } from '../errors/bad-request-error.js';
export class AuthController {
    constructor() {
        this.completeSocioRegister = asyncHandler(async (req, res) => {
            const { email, sexo, tipoDeDocumento, confirmPassword, password, nroDocumento, celular } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new RequestValidationError(errors.array());
            }
            await this.authApi.completeSocioRegister(email, sexo, tipoDeDocumento, confirmPassword, password, nroDocumento, celular);
            res.status(201).json({ success: true, message: 'Ha sido registrado con exito, verifique su email para iniciar sesion' });
        });
        this.validateUser = asyncHandler(async (req, res) => {
            const { token } = req.params;
            await this.authApi.validateUser(token);
            res.render('usuarioValidado');
        });
        this.login = asyncHandler(async (req, res, next) => {
            passport.authenticate('login', (err, user, info) => {
                if (err) {
                    throw new BadRequestError(err);
                }
                if (!user) {
                    console.log(info.message);
                    return res.status(401).json({ message: info.message });
                }
                req.login(user, { session: false }, async (error) => {
                    if (error)
                        return next(error.message);
                    const token = jwt.sign({ id: user.id }, 'adsfdcsfeds3w423ewdas');
                    res.cookie('token', token /* , {
                        sameSite: 'none',
                        secure: true
                    } */);
                    const socio = await this.sociosApi.getSocioById(user.id);
                    return res.status(201).json({ success: true, message: 'sesion iniciada', socio });
                });
            })(req, res, next);
        });
        this.loginAdmin = asyncHandler(async (req, res) => {
            const { codigoAdministrador } = req.body;
            const administrador = await this.administradoresApi.logInAdministrador(codigoAdministrador);
            const token = jwt.sign({ id: administrador.admin.id }, 'adsfdcsfeds3w423ewdas');
            res.cookie('token', token /* , {
                sameSite: 'none',
                secure: true
            } */);
            return res.status(201).json({ administrador });
        });
        this.logout = asyncHandler(async (req, res) => {
            try {
                res.cookie('token', '12323123', {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    expires: new Date(1)
                });
                return res.status(201).json({ success: true, message: 'sesion cerrada' });
            }
            catch (err) {
                return res.status(401).json({ success: false, message: 'error al iniciar sesion' });
            }
        });
        this.resetPasswordRequest = asyncHandler(async (req, res) => {
            const { email } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new RequestValidationError(errors.array());
            }
            await this.authApi.resetPasswordRequest(email);
            res.status(200).json({ success: true, message: 'Revise su casilla de correo para recuperar su contraseña' });
        });
        this.resetPasswordUI = asyncHandler(async (req, res) => {
            try {
                const { token } = req.params;
                res.render('updatePassword', { token });
            }
            catch (error) {
                res.status(500).json({ success: false, message: 'hubo un error ' + error.message });
            }
        });
        this.resetPassword = asyncHandler(async (req, res) => {
            const { newPassword, confirmNewPassword } = req.body;
            const { token } = req.params;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new RequestValidationError(errors.array());
            }
            await this.authApi.resetPassword(token, newPassword, confirmNewPassword);
            res.status(200).json({ mensaje: 'la contraseña ha sido actualizada con exito, inicie sesion nuevamente' });
        });
        this.crearAdministradorTest = asyncHandler(async (req, res) => {
            await this.administradoresDAO.crearAdministradorTest();
            res.status(200).json({ mensaje: 'administrador de prueba creado con exito' });
        });
        this.crearClubTest = asyncHandler(async (req, res) => {
            const club = await this.administradoresDAO.crearClubTest();
            console.log(club);
            res.status(200).json({ mensaje: 'club de prueba creado con exito' });
        });
        this.authApi = new AuthApi();
        this.sociosApi = new SociosApi();
        this.administradoresApi = new AdministradoresApi();
        this.administradoresDAO = new AdministradoresDAO();
    }
}
//# sourceMappingURL=auth.js.map