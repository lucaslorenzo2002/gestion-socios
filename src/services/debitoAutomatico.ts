import { DebitoAutomaticoDAO } from "../database/debitoAutomatico.js";
import { BadRequestError } from "../errors/bad-request-error.js";

export class DebitoAutomaticoApi{
    debitoAutomaticoDAO: DebitoAutomaticoDAO;
	constructor(){
		this.debitoAutomaticoDAO = new DebitoAutomaticoDAO();
	}

	async habilitarDebitoAutomatico(clubAsociadoId: number, mediosDePago: number[]){
		if(mediosDePago.length === 0){
			throw new BadRequestError('Debe asignar por lo menos un medio de pago')
		}
		
		return await this.debitoAutomaticoDAO.habilitarDebitoAutomatico(clubAsociadoId, mediosDePago);
	}

	async getAllMediosDePagoInDebitoAutomatico(clubAsociadoId: number){
		return await this.debitoAutomaticoDAO.getAllMediosDePagoInDebitoAutomatico(clubAsociadoId);
	}
}
