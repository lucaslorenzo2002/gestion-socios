const passport = require('passport');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;

const SociosDAO = require('../database/socios');
const sociosDAO = new SociosDAO();

const AdministradoresApi = require('../services/administradores');
const administradoresApi = new AdministradoresApi();

passport.use('login', new localStrategy({ 
	usernameField: 'nroDocumento',
	passReqToCallback: true 
},  async(req, nroDocumento, password, done) => {

	if(!nroDocumento || !password){
		return done('por favor complete todos los campos');
	}

	const socio = await sociosDAO.getSocioByDocumento(nroDocumento);
	
	if(!socio){
		return done('numero de documento o contrasenia incorrectos');
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

	const administradorCorresponidenteAlClub = await administradoresApi.getAdministradorByClubAsociado(socio.dataValues.club_asociado);
	process.env.MERCADO_PAGO_ACCESS_TOKEN = administradorCorresponidenteAlClub.dataValues.mercado_pago_access_token;
	process.env.MERCADO_PAGO_CLIENT_ID = administradorCorresponidenteAlClub.dataValues.mercado_pago_client_id;
	process.env.MERCADO_PAGO_SECRET_ID = administradorCorresponidenteAlClub.dataValues.mercado_pago_secret_id;
	
	return done(null, socio);
}
));

passport.serializeUser((user, done) => {
	console.log(user);
	return done(null, user.nombres);
});

passport.deserializeUser(async(user, done) => {
	console.log(user);
	const socio = await sociosDAO.getUser(user);
	return done(null, socio);
});