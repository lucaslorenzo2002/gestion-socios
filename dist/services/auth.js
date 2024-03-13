import { SociosDAO } from '../database/socios.js';
import { TokenDAO } from '../database/token.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';
import { hash } from '../utils/hashing.js';
import { BadRequestError } from '../errors/bad-request-error.js';
export class AuthApi {
    constructor() {
        this.sociosDAO = new SociosDAO();
        this.TokenDAO = new TokenDAO();
    }
    async verificateEmail(socioEmail, socioNroDocumento) {
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
    async completeSocioRegister(email, sexo, tipoDeDocumento, confirmarPassword, password, nroDocumento, celular) {
        if (!email || !password || !sexo || !nroDocumento || !tipoDeDocumento || !confirmarPassword || !celular) {
            throw new BadRequestError('Campos incompletos');
        }
        const socioNroDocumento = await this.sociosDAO.getSocioById(nroDocumento);
        if (!socioNroDocumento) {
            throw new BadRequestError('El numero de documento no esta asociado a ningun club');
        }
        if (socioNroDocumento && socioNroDocumento.dataValues.validado) {
            throw new BadRequestError('Socio ya registrado');
        }
        const socioEmail = await this.sociosDAO.getSocioByEmail(email);
        if (socioEmail) {
            throw new BadRequestError('El mail ya esta registrado');
        }
        const socioCelular = await this.sociosDAO.getSocioByCelular(celular);
        if (socioCelular) {
            throw new BadRequestError('El telefono celular ya esta registrado');
        }
        await this.verificateEmail(email, nroDocumento);
        return await this.sociosDAO.completeSocioRegister(nroDocumento, email, hash(password), sexo, tipoDeDocumento, celular);
    }
    async validateUser(tokenParam) {
        const token = await this.TokenDAO.findOneTokenByToken(tokenParam);
        await this.sociosDAO.activateSocio(token.dataValues.socio_id);
    }
    async resetPasswordRequest(email) {
        const socio = await this.sociosDAO.getSocioByEmail(email);
        if (!socio) {
            throw new BadRequestError('El mail ingresado no esta asociado a ningun club');
        }
        let token = await this.TokenDAO.findOneTokenByUser(socio.dataValues.id);
        if (token) {
            await this.TokenDAO.deleteOneToken(socio.dataValues.id);
        }
        let resetToken = crypto.randomBytes(32).toString('hex');
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
    async resetPassword(tokenParam, newPassword, confirmNewPassword) {
        const token = await this.TokenDAO.findOneTokenByToken(tokenParam);
        await this.sociosDAO.updateSocioPassword(token.dataValues.socio_id, hash(newPassword));
    }
    async findOneTokenByToken(tokenParam) {
        return await this.TokenDAO.findOneTokenByToken(tokenParam);
    }
}
//# sourceMappingURL=auth.js.map