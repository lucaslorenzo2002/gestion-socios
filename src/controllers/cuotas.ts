import asyncHandler from 'express-async-handler';
import {CuotasApi} from '../services/cuotas.js';
import {SociosApi} from '../services/socios.js';

export class CuotasController{
	cuotasApi: CuotasApi;
	sociosApi: SociosApi;
	constructor(){
		this.cuotasApi = new CuotasApi();
		this.sociosApi = new SociosApi();
	} 

	programarCuota = asyncHandler(async(req:any, res) => {
		try {
			const {
				tipoDeCuota,
				monto, 
				tipoDeSocio, 
				actividad, 
				categorias, 
				fechaEmision, 
				abonoMultiple, 
				maxCantAbonoMult
			} = req.body;
			const {club_asociado} = req.user;
			const nuevaCuota = await this.cuotasApi.programarCuota(
				tipoDeCuota, 
				fechaEmision, 
				monto, 
				tipoDeSocio, 
				actividad, 
				categorias || [], 
				abonoMultiple, 
				abonoMultiple ? maxCantAbonoMult : null, 
				club_asociado);
			res.status(201).json({success: true, data: nuevaCuota});
		} catch (err) {
			res.status(500).json({success: false, message: err.message});
		}
	});	  

	getMisCuotasPendientes = asyncHandler(async(req:any, res) => {
		try {
			const cuotas = await this.cuotasApi.getMisCuotasPendientes(req.user.id);
			res.status(201).json({success: true, data: cuotas});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getMisCuotasPagas = asyncHandler(async(req: any, res) => {
		try {
			const cuotas = await this.cuotasApi.getMisCuotasPagas(req.user.id);
			res.status(201).json({success: true, data: cuotas});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	totalCuotasPendientes = asyncHandler(async(req: any, res) => {
		try {
			const total = await this.cuotasApi.totalCuotasPendientes(req.params.socioid);
			res.status(201).json({success: true, data: total});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getLast3CuotasPagas = asyncHandler(async(req: any, res) => {
		try {
			const cuotas = await this.cuotasApi.getLast3CuotasPagas(req.user.id);
			res.status(201).json({success: true, data: cuotas});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	 

	getLast3CuotasPagasAdmin = asyncHandler(async(req: any, res) => {
		try {
			const cuotas = await this.cuotasApi.getLast3CuotasPagas(req.params.socioid);
			res.status(201).json({success: true, data: cuotas});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getCuotasSocio = asyncHandler(async(req, res) => {
		try {
			const cuotas = await this.cuotasApi.getAllCuotasSocio(parseInt(req.params.id));
			res.status(201).json({success: true, data: cuotas});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getAllCuotas = asyncHandler(async(req: any, res) => {
		try {
			const cuotas = await this.cuotasApi.getAllCuotas(req.user.club_asociado_id);
			res.status(201).json({success: true, data: cuotas});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	pagarCuotaDesdeAdmin = asyncHandler(async(req: any, res) => {
		try {
			const{formaDePago, deuda, id} = req.body;
			console.log(req.body);
			const{sociocuotaid} = req.params;
			const{club_asociado_id} = req.user;
			await this.cuotasApi.pagarCuota(formaDePago, deuda, id, sociocuotaid, club_asociado_id);
			const socio = await this.sociosApi.getSocioById(id);
			res.status(201).json({success: true, message: `la cuota de ${socio.dataValues.nombres} ${socio.dataValues.apellido} ha sido pagada con exito`});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	

	getSocioCuota = asyncHandler(async(req, res) => {
		try {
			const cuota = await this.cuotasApi.getSocioCuota(parseInt(req.params.cuotaid));
			res.status(201).json({success: true, data: cuota});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getCuotasProgramadas = asyncHandler(async(req:any, res) => {
		try {
			const cuotas = await this.cuotasApi.getCuotasProgramadas(req.user.club_asociado_id);
			res.status(201).json({success: true, data: cuotas});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

 	eliminarCuotaProgramada = asyncHandler(async(req: any, res) => {
		try {
			const {tipoDeSocioId, actividadId, categoriaId} = req.body.data;
			const {club_asociado_id} = req.user;
			console.log(req.body.data)
			const cuotasProgramadas = await this.cuotasApi.eliminarCuotaProgramada(
				tipoDeSocioId, 
				actividadId, 
				categoriaId, 
				club_asociado_id
				); 
			res.status(201).json({success: true, data: cuotasProgramadas});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	 

	actualizarValorDeCuota = asyncHandler(async(req: any, res) => {
		try {
			const {tipoDeSocioId, actividadId, categoriaId, monto} = req.body.data;
			const {club_asociado_id} = req.user
			await this.cuotasApi.actualizarValorDeCuota(club_asociado_id, tipoDeSocioId, actividadId, categoriaId, parseInt(monto));
			res.status(201).json({success: true, message: 'Cuota actualizada con exito'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  
}