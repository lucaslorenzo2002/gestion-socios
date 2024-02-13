const asyncHandler = require('express-async-handler');
const CuotasApi = require('../services/cuotas');
const SociosApi = require('../services/socios');

class CuotasController{
	constructor(){
		this.cuotasApi = new CuotasApi();
		this.sociosApi = new SociosApi();
	} 

	programarCuota = asyncHandler(async(req, res) => {
		try {
			const {monto, to, fechaEmision, abonoMultiple, maxCantAbonoMult} = req.body;
			const {club_asociado} = req.user;
			const nuevaCuota = await this.cuotasApi.programarCuota(fechaEmision, monto, to, abonoMultiple, abonoMultiple ? maxCantAbonoMult : null, club_asociado);
			res.status(201).json({success: true, data: nuevaCuota});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getMisCuotasPendientes = asyncHandler(async(req, res) => {
		try {
			const cuotas = await this.cuotasApi.getMisCuotasPendientes(req.user.id);
			res.status(201).json({success: true, data: cuotas});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getMisCuotasPagas = asyncHandler(async(req, res) => {
		try {
			const cuotas = await this.cuotasApi.getMisCuotasPagas(req.user.id);
			res.status(201).json({success: true, data: cuotas});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getLast3CuotasPagas = asyncHandler(async(req, res) => {
		try {
			const cuotas = await this.cuotasApi.getLast3CuotasPagas(req.user.id);
			res.status(201).json({success: true, data: cuotas});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getCuotasSocio = asyncHandler(async(req, res) => {
		try {
			const cuotas = await this.cuotasApi.getAllCuotasSocio(req.params.id);
			res.status(201).json({success: true, data: cuotas});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getAllCuotas = asyncHandler(async(req, res) => {
		try {
			const cuotas = await this.cuotasApi.getAllCuotas(req.user.club_asociado_id);
			res.status(201).json({success: true, data: cuotas});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	pagarCuotaDesdeAdmin = asyncHandler(async(req, res) => {
		try {
			const{formaDePago, deuda, id} = req.body;
			const{sociocuotaid} = req.params;
			await this.cuotasApi.pagarCuota(formaDePago, deuda, id, sociocuotaid);
			const socio = await this.sociosApi.getSocioById(id);
			res.status(201).json({success: true, message: `la cuota de ${socio.dataValues.nombres} ${socio.dataValues.apellido} ha sido pagada con exito`});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	

	getSocioCuota = asyncHandler(async(req, res) => {
		try {
			const cuota = await this.cuotasApi.getSocioCuota(req.params.cuotaid);
			res.status(201).json({success: true, data: cuota});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getCuotasProgramadas = asyncHandler(async(req, res) => {
		try {
			const cuotas = await this.cuotasApi.getCuotasProgramadas(req.user.club_asociado_id);
			res.status(201).json({success: true, data: cuotas});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	eliminarCuotaProgramada = asyncHandler(async(req, res) => {
		try {
			const cuotasProgramadas = await this.cuotasApi.eliminarCuotaProgramada(req.params.to, req.user.club_asociado_id);
			res.status(201).json({success: true, data: cuotasProgramadas});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	actualizarValorDeCuota = asyncHandler(async(req, res) => {
		try {
			await this.cuotasApi.actualizarValorDeCuota(req.user.club_asociado_id, req.body.to, req.body.monto);
			res.status(201).json({success: true, message: 'cuota actualizada con exito'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  
}

module.exports = CuotasController;