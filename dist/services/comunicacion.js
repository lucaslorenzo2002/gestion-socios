import sendEmail from '../utils/sendEmail.js';
import { SociosApi } from './socios.js';
export class ComunicacionApi {
    constructor() {
        this.sociosApi = new SociosApi();
    }
    async enviarMailsIndividualizado(message, subject, mails) {
        let from = process.env.EMAIL_USER;
        for (let i = 0; i < mails.length; i++) {
            let to = mails[i];
            await sendEmail(from, to, subject, message);
        }
    }
    async enviarMailsMasivos(message, subject, actividadId, tipoSocioId, categoriasId, clubAsociadoId) {
        const targetSocios = await this.sociosApi.getAllSociosWithEmailInActividadOrTipoSocio(actividadId, tipoSocioId, categoriasId, clubAsociadoId);
        console.log(targetSocios);
        /* let from = process.env.EMAIL_USER;
        for (let i = 0; i < targetSocios.length; i++) {
            
            let to = targetSocios[i].dataValues.email;

            await sendEmail(from, to, subject, message);
        } */
    }
    async enviarMailDeCumpleaños() {
    }
}
//# sourceMappingURL=comunicacion.js.map