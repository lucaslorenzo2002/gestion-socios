import { MediosDePagoDAO } from '../database/mediosDePago.js';

export class MediosDePagoApi{
    mediosDePagoDAO: MediosDePagoDAO;
	constructor(){
		this.mediosDePagoDAO = new MediosDePagoDAO();
	}

	async getAllMediosDePago(){
		return await this.mediosDePagoDAO.getAllMediosDePago()
	}

}
