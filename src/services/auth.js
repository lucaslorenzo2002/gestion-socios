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
			socio_nro_documento: socioNroDocumento,
			token: verificateEmailToken
		}).save();

		let resetUrl = `http://localhost:4000/api/confirmaremail/${verificateEmailToken}`;

		let message = `
        <h2>BIENVENIDO!</h2>
        <p>hace en click en la url proporcionada para confirmar tu cuenta de email</p>
        <p>el link es valido por una hora</p> 
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>`;
        

		let from = process.env.EMAIL_USER;
		console.log(process.env.EMAIL_USER)

		let to = socioEmail;

		let subject = 'Activar cuenta';

		await sendEmail(from, to, subject, message);
	}

	async completeSocioRegister(email, sexo, tipoDeDocumento, confirmarPassword, password, nroDocumento, celular){

		if( !email || !password || !sexo || !nroDocumento || !tipoDeDocumento || !confirmarPassword || !celular ){
			return('completa todos los campos');
		}

		const socioNroDocumento = await this.sociosDAO.getSocioByDocumento(nroDocumento);
		if(!socioNroDocumento){
			return('el numero de documento no esta asociado');
		}

		const socioEmail = await this.sociosDAO.getUserByMail(email);
		if(socioEmail){
			return('el mail ya esta en uso');
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
		await this.sociosDAO.activateSocio(token.dataValues.socio_nro_documento);
	}

	async resetPasswordRequest(userMail){
		const user = await this.usersDAO.getUserByMail(userMail); 

		if (!user) {
			throw new Error('User does not exist');
		}
		let token = await this.TokenDAO.findOneTokenByUser(user.id);
		if (token) { 
			await this.TokenDAO.deleteOneToken();
		}

		let resetToken = crypto.randomBytes(32).toString('hex');

		await new Token({
			user_id: user.id,
			token: resetToken
		}).save();

		let resetUrl = `https://socialmediaclone-production-1e63.up.railway.app/resetpassword/${resetToken}`;

		let message = `
        <h2>PORFAVOR NO RESPONDER ESTE MENSAJE</h2>
        <h3>Estimado Socio:</h3>
        <p>hace en click en la url proporcionada para cambiar tu contrasenia</p>
        <p>el link es valido por una hora</p> 
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        <p>Saludos...</p> `;

		let from = process.env.EMAIL_USER;

		let to = user.email;

		let subject = 'Cambiar contrasenia';

		await sendEmail(from, to, subject, message);
	}

	async resetPassword(tokenParam, newPassword, confirmNewPassword){
		const token = await this.TokenDAO.findOneTokenByToken(tokenParam);

		if(newPassword === confirmNewPassword){
			await this.usersDAO.updateUserPassword(token.user_id, hash(newPassword));
		}else{
			throw new Error('las contrasenias no son iguales');
		} 
	}

	async findOneTokenByToken(tokenParam){
		return await this.TokenDAO.findOneTokenByToken(tokenParam);
	}
}

module.exports = AuthApi;