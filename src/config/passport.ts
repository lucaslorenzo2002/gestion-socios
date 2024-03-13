import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import {Request} from 'express';

import {SociosDAO} from '../database/socios.js';
const sociosDAO = new SociosDAO();

import {AdministradoresApi} from '../services/administradores.js';
const administradoresApi = new AdministradoresApi();

passport.use('login', new LocalStrategy({ 
	usernameField: 'nroDocumento',
	passReqToCallback: true 
},  async(req: Request, nroDocumento: any, password: string, done: any) => {

	if(!nroDocumento || !password){
		return done('por favor complete todos los campos');
	}

	const socio: any = await sociosDAO.getSocioById(nroDocumento);
	
	if(!socio){
		return done('numero de documento o contraseña incorrectos');
	}

	if(socio.password === null){
		return done('tu numero de documento esta asociado, completa el registro para ingresar');
	}

	const correctPassword = await bcrypt.compare(password, socio.password);

	if (!socio || !correctPassword){
		return done('numero de documento o contrasenia incorrectos');
	} 

	if(!socio.validado){
		return done('usuario no activado');
	}

	const administradorCorresponidenteAlClub = await administradoresApi.getAdministradorByClubAsociado(socio.dataValues.club_asociado_id);
	process.env.MERCADO_PAGO_ACCESS_TOKEN = administradorCorresponidenteAlClub.dataValues.mercado_pago_access_token;
	process.env.MERCADO_PAGO_CLIENT_ID = administradorCorresponidenteAlClub.dataValues.mercado_pago_client_id;
	process.env.MERCADO_PAGO_SECRET_ID = administradorCorresponidenteAlClub.dataValues.mercado_pago_secret_id;
	
	return done(null, socio);
}
));

passport.serializeUser((user: any, done: any) => {
	return done(null, user.nombres);
});

passport.deserializeUser(async(user, done) => {
	const socio = await sociosDAO.getSocioById(user);
	return done(null, socio);
});