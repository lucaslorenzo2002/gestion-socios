import {SociosDAO} from '../database/socios.js';
import {TokenDAO} from '../database/token.js';
import sendEmail from '../utils/sendEmail.js'; 
import crypto from 'crypto';
import {hash} from '../utils/hashing.js';

export class AuthApi{
    TokenDAO: TokenDAO;
	sociosDAO: SociosDAO;
	constructor(){
		this.sociosDAO = new SociosDAO();
		this.TokenDAO = new TokenDAO();
	}

	async verificateEmail(socioEmail: string, socioNroDocumento: number){
		let verificateEmailToken = crypto.randomBytes(32).toString('hex');

        await this.TokenDAO.createToken(socioNroDocumento, verificateEmailToken);

		let resetUrl = `https://lao-software-backend.onrender.com/api/confirmaremail/${verificateEmailToken}`;

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

	async completeSocioRegister(
        email: string, 
        sexo: string, 
        tipoDeDocumento: string, 
        confirmarPassword: string, 
        password: string, 
        nroDocumento: number, 
        celular: string
        ){

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

	async validateUser(tokenParam: string){
		const token = await this.TokenDAO.findOneTokenByToken(tokenParam);
		await this.sociosDAO.activateSocio(token.dataValues.socio_id);
	}

	async resetPasswordRequest(email: string){
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
		
        await this.TokenDAO.createToken(socio.dataValues.id, resetToken);

		let resetUrl = `https://lao-software-backend.onrender.com/api/resetpassword/${resetToken}`;

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

	async resetPassword(tokenParam: string, newPassword: string, confirmNewPassword: string){
		const token = await this.TokenDAO.findOneTokenByToken(tokenParam);

		if(newPassword === confirmNewPassword){
			await this.sociosDAO.updateSocioPassword(token.dataValues.socio_id, hash(newPassword));
		}else{
			throw new Error('las contrasenias no son iguales');
		} 
	}

	async findOneTokenByToken(tokenParam: string){
		return await this.TokenDAO.findOneTokenByToken(tokenParam);
	}
}
