import sendEmail from '../utils/sendEmail.js'; 
import { BadRequestError } from '../errors/bad-request-error.js';
import { SociosApi } from './socios.js';

export class ComunicacionApi{
    sociosApi: SociosApi;
    constructor(){
        this.sociosApi = new SociosApi()
    }

	async enviarMailsIndividualizado(message: string, subject: string, mails: string[]){
		let from = process.env.EMAIL_USER;

        for (let i = 0; i < mails.length; i++) {
            let to = mails[i];

		    await sendEmail(from, to, subject, message);
        }
	}

    async enviarMailsMasivos(
        message:string, 
        subject:string, 
        actividadId: number, 
        tipoSocioId: number, 
        categoriasId: number[],
        clubAsociadoId: number
        ){
        const targetSocios = await this.sociosApi.getAllSociosWithEmailInActividadOrTipoSocio(actividadId, tipoSocioId, categoriasId, clubAsociadoId);
        console.log(targetSocios)
        /* let from = process.env.EMAIL_USER;
        for (let i = 0; i < targetSocios.length; i++) {
            
            let to = targetSocios[i].dataValues.email;

		    await sendEmail(from, to, subject, message);
        } */
    }

    async enviarMailDeCumpleaños(){

    }
}
