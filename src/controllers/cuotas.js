const asyncHandler = require('express-async-handler');
const CuotasApi = require('../services/cuotas');

class CuotasController{
	constructor(){
		this.cuotasApi = new CuotasApi();
	}

	createCuota = asyncHandler(async(req, res) => {
		try {
			const {monto, to} = req.body;
			await this.cuotasApi.createCuota(monto, to, req.user.club_asociado);
			res.status(201).json({success: true, message: 'cuota generada con exito'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err});
		}
	});	  

	getMisCuotas = asyncHandler(async(req, res) => {
		try {
			const cuotas = await this.cuotasApi.getMisCuotas(req.user.id);
			res.status(201).json({success: true, data: cuotas});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err});
		}
	});	  

	getCuotasSocio = asyncHandler(async(req, res) => {
		try {
			const cuotas = await this.cuotasApi.getMisCuotas(req.params.id);
			res.status(201).json({success: true, data: cuotas});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err});
		}
	});	  

	getAllCuotas = asyncHandler(async(req, res) => {
		try {
			const cuotas = await this.cuotasApi.getAllCuotas(req.user.club_asociado);
			res.status(201).json({success: true, data: cuotas});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err});
		}
	});	  

	pagarCuota = asyncHandler(async(req, res) => {
		try {
			const{deuda, id, email} = req.user;
			const{formaDePago, socioDni, cardNumber, cardExpirationMonth, cardExpirationYear, cardholderName, cvv} = req.body;
			const{sociocuotaid} = req.params;
			await this.cuotasApi.pagarCuota(formaDePago, deuda, id, sociocuotaid, email, socioDni, cardNumber, cardExpirationMonth, cardExpirationYear, cardholderName, cvv);
			res.status(201).json({success: true, message: 'cuota pagada con exito'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err});
		}
	});	  

}

module.exports = CuotasController;