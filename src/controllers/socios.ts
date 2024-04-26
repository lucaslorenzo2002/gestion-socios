import { Request, Response } from "express";
import asyncHandler from 'express-async-handler';
import {SociosApi} from '../services/socios.js';
import { InscripcionesApi } from "../services/inscripciones.js";
import {validationResult} from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error.js';

export class SociosController{
    sociosApi: SociosApi;
	inscripcionesApi: InscripcionesApi;
	constructor(){
		this.sociosApi = new SociosApi();
		this.inscripcionesApi = new InscripcionesApi();
	}

	createSocio = asyncHandler(async(req: any, res: Response) => {
		const { nombres, apellido, id, socioDesde } = req.body;
		const fileTempFilePath = req.files?.fotoDePerfil?.tempFilePath || null;
		const fileName = req.files?.fotoDePerfil.name || null;
		const fileUrl = req.files ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}` : null;
	
		const errors = validationResult(req);

		if(!errors.isEmpty()){
			throw new RequestValidationError(errors.array());
		}

		await this.sociosApi.createSocio(
			parseInt(id),
			nombres,
			apellido,
			req.user.club_asociado_id,
			fileTempFilePath,
			fileName,
			fileUrl,
			socioDesde
		);

		res.status(200).json({success: true, message: 'nuevo socio registrado'});
	});	    

	getSocioById = asyncHandler(async(req:Request, res: Response) => {
		try {
			const socio:{} = await this.sociosApi.getSocioById(parseInt(req.params.id));
			res.status(201).json({success: true, data: socio});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getSocioByIdSocio = asyncHandler(async(req:any, res: Response) => {
		try {
			const socio: {} = await this.sociosApi.getSocioById(req.user.id);
			res.status(201).json({success: true, data: socio});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	darDeBaja = asyncHandler(async(req:Request, res: Response) => {
		try {
			await this.sociosApi.darDeBaja(parseInt(req.params.socioid));
			res.status(201).json({success: true, message: 'socio dado de baja exitosamente'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	darDeAlta = asyncHandler(async(req:Request, res: Response) => {
		try {
			await this.sociosApi.darDeAlta(parseInt(req.params.socioid));
			res.status(201).json({success: true, message: 'socio activado exitosamente'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	updateSocioData = asyncHandler(async(req:any, res: Response) => {
		try {
			const{fecNacimiento, edad, telefonoCelular, codigoPostal, direccion, ciudad, provincia, poseeObraSocial, siglas, rnos, numeroDeAfiliados, denominacionDeObraSocial} = req.body;
			await this.sociosApi.updateSocioData(fecNacimiento, edad, telefonoCelular, codigoPostal, direccion, ciudad, provincia, poseeObraSocial, siglas, rnos, numeroDeAfiliados, denominacionDeObraSocial, req.user.id);
			res.status(201).json({success: true, message: 'datos sincronizados con el club'});
		} catch (err) {
			console.log(err.message);
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getAllSocios = asyncHandler(async(req:any, res: Response) => {
		try {
			const socios = await this.sociosApi.getAllSocios(req.user.club_asociado_id);
			res.status(201).json({success: true, data: socios});
		} catch (err) {
			console.log(err.message);
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	

	getAllSociosSinTipoSocio = asyncHandler(async(req:any, res: Response) => {
		try {
			const socios = await this.sociosApi.getAllSociosSinTipoSocio(req.user.club_asociado_id);
			res.status(201).json({success: true, data: socios});
		} catch (err) {
			console.log(err.message);
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	

	getAllSociosEnTipoSocio = asyncHandler(async(req:any, res: Response) => {
		try {
			const socios = await this.sociosApi.getAllSociosEnTipoSocio(req.user.club_asociado_id, req.params.tiposocio);
			res.status(201).json({success: true, data: socios});
		} catch (err) {
			console.log(err.message);
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	

	getSocioDeudaDesdeAdmin = asyncHandler(async(req:Request, res) => {
		const{id} = req.params;
		const socioDeuda = await this.sociosApi.getSocioDeuda(parseInt(id));

		res.status(201).json({success: true, data: socioDeuda});
	});	

	getSocioDeuda = asyncHandler(async(req:any, res) => {
		const{id} = req.user;
		const socioDeuda = await this.sociosApi.getSocioDeuda(id);

		res.status(201).json({success: true, data: socioDeuda});
	});	

	eliminarSocioDeTipoDeSocio = asyncHandler(async(req: any, res: Response) => {
		try {
			const {ids, tipoSocio} = req.body;
			const {tiposocioid} = req.params;
			await this.sociosApi.eliminarSocioDeTipoDeSocio(ids, tiposocioid, req.user.club_asociado_id);
			res.status(201).json({success: true, message: `Socios de ${tipoSocio} actualizados`});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	

	agregarSocioATipoDeSocio = asyncHandler(async(req: any, res: Response) => {
		const {club_asociado} = req.user;
		const {ids, tipoSocio} = req.body;
		const {tiposocioid} = req.params;
		await this.sociosApi.asignarInscripcionSocial(ids, tiposocioid, club_asociado.id);

		res.status(201).json({success: true, message: `Socios agregados a ${tipoSocio} con exito`});	
	});	 

	getAllSociosWithEmail = asyncHandler(async(req: any, res: Response) => {
		const {club_asociado} = req.user;
		const sociosFiltrados = await this.sociosApi.getAllSociosWithEmail(club_asociado.id);
		
		res.status(201).json({success: true, data: sociosFiltrados});
	});	 

	getAllSociosSinGrupoFamiliar = asyncHandler(async(req: any, res: Response) => {
		const {club_asociado} = req.user;
		const socios = await this.sociosApi.getAllSociosSinGrupoFamiliar(club_asociado.id);
		
		res.status(201).json({success: true, data: socios});
	});	 

	getAllFamiliaresEnGrupoFamiliar = asyncHandler(async(req: any, res: Response) => {
		const {club_asociado} = req.user;
		const {grupofamiliarid} = req.params;
		const familiares = await this.sociosApi.getAllFamiliaresEnGrupoFamiliar(grupofamiliarid, club_asociado.id);
		
		res.status(201).json({success: true, data: familiares}); 
	});	 

	getAllSociosEnDebitoAutomatico = asyncHandler(async(req: any, res: Response) => {
		const {club_asociado} = req.user;
		const socios = await this.sociosApi.getAllSociosEnDebitoAutomatico(club_asociado.id);
		
		res.status(201).json({success: true, data: socios}); 
	});	 

}
