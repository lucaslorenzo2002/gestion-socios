const SociosDAO = require('../database/socios');
const TokenDAO = require('../database/token');
const Token = require('../models/token');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const hash = require('../utils/hashing');

class AuthApi{
	constructor(){
		this.sociosDAO = new SociosDAO();
		this.TokenDAO = new TokenDAO();
	}

	async verificateEmail(socioEmail, socioNroDocumento){
		let verificateEmailToken = crypto.randomBytes(32).toString('hex');

		await new Token({
			socio_id: socioNroDocumento,
			token: verificateEmailToken
		}).save();

		let resetUrl = `http://localhost:4000/api/confirmaremail/${verificateEmailToken}`;

		let message = `
        <h2>BIENVENIDO!</h2>
        <p>hace en click en la url proporcionada para confirmar tu cuenta de email</p>
        <p>el link es valido por una hora</p> 
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>`;
        

		let from = process.env.EMAIL_USER;
		console.log(process.env.EMAIL_USER);

		let to = socioEmail;

		let subject = 'Activar cuenta';

		await sendEmail(from, to, subject, message);
	}

	async completeSocioRegister(email, sexo, tipoDeDocumento, confirmarPassword, password, nroDocumento, celular){

		if( !email || !password || !sexo || !nroDocumento || !tipoDeDocumento || !confirmarPassword || !celular ){
			return('completa todos los campos');
		}

		const socioNroDocumento = await this.sociosDAO.getSocioById(nroDocumento);
		if(!socioNroDocumento){
			return('el numero de documento no esta asociado');
		}

		const socioEmail = await this.sociosDAO.getSocioByEmail(email);
		if(socioEmail){
			return('el mail ya esta registrado');
		}

		const socioCelular = await this.sociosDAO.getSocioByCelular(celular);
		if(socioCelular){
			return('el telefono celular ya esta registrado');
		}
	
		if(password.length < 8){
			return ('la contraseña debe tener al menos 8 caracteres');
		}
	
		if(password !== confirmarPassword){
			return ('las contraseñas no coinciden');
		}

		await this.verificateEmail(email, nroDocumento);
		const newSocio = await this.sociosDAO.completeSocioRegister(nroDocumento, email, hash(password),sexo, tipoDeDocumento, celular);

		return newSocio;
	}

	async validateUser(tokenParam){
		const token = await this.TokenDAO.findOneTokenByToken(tokenParam);
		await this.sociosDAO.activateSocio(token.dataValues.socio_id);
	}

	async resetPasswordRequest(email){
		const socio = await this.sociosDAO.getSocioByEmail(email); 
		
		if (!socio) {
			throw new Error('El socio no esta registrado');
		}
		
		let token = await this.TokenDAO.findOneTokenByUser(socio.dataValues.id);
		if (token) { 
			await this.TokenDAO.deleteOneToken(socio.dataValues.id);
		}

		let resetToken = crypto.randomBytes(32).toString('hex');
		console.log(resetToken);
		
		await new Token({
			socio_id: socio.dataValues.id,
			token: resetToken
		}).save();

		let resetUrl = `http://localhost:4000/api/resetpassword/${resetToken}`;

		let message = `
        <h2>PORFAVOR NO RESPONDER ESTE MENSAJE</h2>
        <h3>Estimado Socio:</h3>
        <p>haga en click en la url proporcionada para cambiar su contrasenia</p>
        <p>el link es valido por una hora</p> 
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        <p>Saludos...</p> `;

		let from = process.env.EMAIL_USER;

		let to = socio.dataValues.email;

		let subject = 'Cambiar contrasenia';

		await sendEmail(from, to, subject, message); 
	}

	async resetPassword(tokenParam, newPassword, confirmNewPassword){
		const token = await this.TokenDAO.findOneTokenByToken(tokenParam);

		if(newPassword === confirmNewPassword){
			await this.sociosDAO.updateSocioPassword(token.dataValues.socio_id, hash(newPassword));
		}else{
			throw new Error('las contrasenias no son iguales');
		} 
	}

	async findOneTokenByToken(tokenParam){
		return await this.TokenDAO.findOneTokenByToken(tokenParam);
	}
}

module.exports = AuthApi;