const passport = require('passport');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;

const SociosDAO = require('../database/socios');
const sociosDAO = new SociosDAO();

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

	const correctPassword = await bcrypt.compare(password, socio.password);

	if (!socio || !correctPassword){
		return done('numero de documento o contrasenia incorrectos');
	} 

	if(!socio.validado){
		return done('usuario no activado');
	}

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