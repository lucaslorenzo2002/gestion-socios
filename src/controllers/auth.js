const asyncHandler = require('express-async-handler');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const AuthApi = require('../services/auth');
const SociosApi = require('../services/socios');
const AdministradoresApi = require('../services/administradores');

class AuthController{
	constructor(){
		this.authApi = new AuthApi();
		this.sociosApi = new SociosApi();
		this.administradoresApi = new AdministradoresApi();
	}

	completeSocioRegister = asyncHandler(async(req, res) => {
		try {
			const {email, sexo, tipoDeDocumento, confirmPassword, password, nroDocumento, celular} = req.body;
			const newSocio = await this.authApi.completeSocioRegister(email, sexo, tipoDeDocumento, confirmPassword, password, nroDocumento, celular);

			res.status(201).json({success: true, message: typeof newSocio === 'string' ? newSocio : 'Socio confirmado, verificar mail'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	validateUser = asyncHandler(async (req, res) => {
		try {
			const {token} = req.params;
			await this.authApi.validateUser(token);
			res.status(201).json({ success: true, message: 'socio validado inicie sesion para usar la app'});
		} catch (error) {
			res.status(500).json({success: false, message: 'hubo un error ' + error});
		}
	});

	login = asyncHandler(async (req, res, next) => {
		passport.authenticate('login', (err, user, info) => {
			if (err) {
				return next(err);
			}
			if (!user) {
				return res.status(401).json({ message: info.message });
			}
			req.login(user,
				{ session: false },
				async (error) => {
					if (error) return next(error.message);            
					const token = jwt.sign({ id: user.id}, 'adsfdcsfeds3w423ewdas');
					res.cookie('token', token);
					const socio = await this.sociosApi.getSocioById(user.id);
					return res.status(201).json({ success: true, message: 'sesion iniciada', socio});
				});
		})(req, res, next);
	});

	loginAdmin = asyncHandler(async (req, res) => {
		try {
			const administrador = await this.administradoresApi.logInAdministrador(req.body.codigoAdministrador);
			const token = jwt.sign({ id: administrador.admin.id}, 'adsfdcsfeds3w423ewdas');
			res.cookie('token', token/* , { 
				sameSite: 'None', 
				secure: true 
			} */);
			return res.status(201).json({administrador});
		} catch (err) {
			return res.status(401).json({ success: false, message: 'error al iniciar sesion: ' + err.message});
		}
	});

	logout = asyncHandler(async (req, res) => {
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
/* 	resetPasswordRequest = asyncHandler(async(req, res) => {
		try {
			await this.authApi.resetPasswordRequest(req.body.email);
			res.status(200).json({success: true, message: 'mail enviado'});
		} catch (error) {
			res.status(500).json({success: false, message: 'mail no enviado, probar de nuevo'});
		}
	}); 

	resetPassword = asyncHandler(async(req, res) => {
		try {
			await this.authApi.resetPassword(req.params.token, req.body.newPassword, req.body.confirmNewPassword);
			res.status(200).json({success: true, message: 'contrasenia actualizada'});
		} catch (error) {
			res.status(500).json({success: false, message: 'hubo un error ' + error});
		}
	});  */
}

module.exports = AuthController;