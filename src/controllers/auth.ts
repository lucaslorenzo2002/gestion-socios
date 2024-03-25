import asyncHandler from 'express-async-handler';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import {AuthApi} from '../services/auth.js';
import {SociosApi} from '../services/socios.js';
import {AdministradoresApi} from '../services/administradores.js';
import { NextFunction, Request, Response } from 'express';
import { ISocioAttrs } from '../interfaces/ISocioAttrs.js';
import {validationResult} from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error.js';

export class AuthController{
    authApi: AuthApi;
	administradoresApi: AdministradoresApi;
	sociosApi: SociosApi;
	constructor(){
		this.authApi = new AuthApi();
		this.sociosApi = new SociosApi();
		this.administradoresApi = new AdministradoresApi();
	}

	completeSocioRegister = asyncHandler(async(req:Request, res:Response) => {
		const {email, sexo, tipoDeDocumento, confirmPassword, password, nroDocumento, celular} = req.body;
		
		const errors = validationResult(req);

		if(!errors.isEmpty()){
			throw new RequestValidationError(errors.array());
		}

		await this.authApi.completeSocioRegister(email, sexo, tipoDeDocumento, confirmPassword, password, nroDocumento, celular);

		res.status(201).json({success: true, message: 'Ha sido registrado con exito, verifique su email para iniciar sesion'});
	});	  

	validateUser = asyncHandler(async (req:Request, res:Response) => {
		const {token} = req.params;
		await this.authApi.validateUser(token);

		res.render('usuarioValidado');
	});

	login = asyncHandler(async (req:Request, res:Response, next: NextFunction) => {
		passport.authenticate('login', (err:Error, user: ISocioAttrs, info: any) => {
			if (err) {
				console.log(err);
				console.log(err.message);
				return next(err);
			}
			if (!user) {
				console.log(info.message);
				return res.status(401).json({ message: info.message });
			}
			req.login(user,
				{ session: false },
				async (error) => {
					if (error) return next(error.message);            
					const token = jwt.sign({ id: user.id}, 'adsfdcsfeds3w423ewdas');
					res.cookie('token', token , { 
						sameSite: 'none', 
						secure: true 
					});
					const socio = await this.sociosApi.getSocioById(user.id);
					return res.status(201).json({ success: true, message: 'sesion iniciada', socio});
				});
		})(req, res, next);
	});

	loginAdmin = asyncHandler(async (req:any, res:any) => {
		const{codigoAdministrador} = req.body;
		const administrador = await this.administradoresApi.logInAdministrador(codigoAdministrador);
		const token = jwt.sign({ id: administrador.admin.id}, 'adsfdcsfeds3w423ewdas');
		res.cookie('token', token, { 
			sameSite: 'none', 
			secure: true 
		});
		return res.status(201).json({administrador});
	});

	logout = asyncHandler(async (req:any, res:any) => {
		try {
			res.cookie('token', '12323123',{
				httpOnly: true, 
				secure: true,
				sameSite: 'none',    
				expires: new Date(1)
			});
			return res.status(201).json({success: true, message: 'sesion cerrada'});
		} catch (err) {
			return res.status(401).json({ success: false, message: 'error al iniciar sesion'});
		}
	});
	
	resetPasswordRequest = asyncHandler(async(req:Request, res:Response) => {
		const {email} = req.body;

		const errors = validationResult(req);

		if(!errors.isEmpty()){
			throw new RequestValidationError(errors.array());
		}

		await this.authApi.resetPasswordRequest(email);

		res.status(200).json({success: true, message: 'Revise su casilla de correo para recuperar su contraseña'});
	}); 

	resetPasswordUI = asyncHandler(async(req:Request, res:Response) => {
		try {
			const {token} = req.params;
			res.render('updatePassword', {token});
		} catch (error) {
			res.status(500).json({success: false, message: 'hubo un error ' + error.message});
		}
	});  

	resetPassword = asyncHandler(async(req:Request, res:Response) => {
		const{newPassword, confirmNewPassword} = req.body;
		const{token} = req.params;

		const errors = validationResult(req);

		if(!errors.isEmpty()){
			throw new RequestValidationError(errors.array());
		}

		await this.authApi.resetPassword(token, newPassword, confirmNewPassword);
			
		res.status(200).json({mensaje: 'la contraseña ha sido actualizada con exito, inicie sesion nuevamente'});
	});  
}
