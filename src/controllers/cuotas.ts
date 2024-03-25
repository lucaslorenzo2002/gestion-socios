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
	});	  

	getMisCuotasPendientes = asyncHandler(async(req:any, res) => {
		const {club_asociado_id, id} = req.user;
		const cuotas = await this.cuotasApi.getMisCuotasPendientes(id, club_asociado_id);

		res.status(201).json({success: true, data: cuotas});
	});	  

	getMisCuotasPagas = asyncHandler(async(req: any, res) => {
		const {id, club_asociado_id} = req.user;
		const cuotas = await this.cuotasApi.getMisCuotasPagas(id, club_asociado_id);

		res.status(201).json({success: true, data: cuotas});
	});	  

	totalCuotasPendientes = asyncHandler(async(req: any, res) => {
		const {club_asociado_id} = req.user;
		const {socioid} = req.params;
		const total = await this.cuotasApi.totalCuotasPendientes(socioid, club_asociado_id);

		res.status(201).json({success: true, data: total});
	});	  

	getLast3CuotasPagas = asyncHandler(async(req: any, res) => {
		const {id, club_asociado_id} = req.user;
		const cuotas = await this.cuotasApi.getLast3CuotasPagas(id, club_asociado_id);
		
		res.status(201).json({success: true, data: cuotas});
	});	 

	getLast3CuotasPagasAdmin = asyncHandler(async(req: any, res) => {
		const {socioid} = req.params;
		const {club_asociado_id} = req.user;
		const cuotas = await this.cuotasApi.getLast3CuotasPagas(socioid, club_asociado_id);
		
		res.status(201).json({success: true, data: cuotas});
	});	  

	getCuotasSocio = asyncHandler(async(req: any, res) => {
		const {id} = req.params;
		const {club_asociado} = req.user;
		const cuotas = await this.cuotasApi.getAllCuotasSocio(parseInt(id), club_asociado.id);

		res.status(201).json({success: true, data: cuotas});
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
			const{formaDePago, deuda, mesesAbonados, tipoDeCuota, id} = req.body;
			const{sociocuotaid} = req.params;
			const{club_asociado_id} = req.user;
			await this.cuotasApi.pagarCuota(formaDePago, deuda, id, sociocuotaid, club_asociado_id, tipoDeCuota, mesesAbonados);
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