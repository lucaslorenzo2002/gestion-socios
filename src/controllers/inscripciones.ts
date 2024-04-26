import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { InscripcionesApi } from '../services/inscripciones.js';

export class InscripcionesController{
	inscripcionesApi: InscripcionesApi;
	constructor(){
		this.inscripcionesApi = new InscripcionesApi();
	}

	programarInscripcion = asyncHandler(async(req: any, res: Response) => {
        const {club_asociado} = req.user;
        const {monto, frecuenciaDeAbono, tipoDeSocio, actividad, categorias} = req.body;
		await this.inscripcionesApi.programarInscripcion(frecuenciaDeAbono, parseInt(monto), tipoDeSocio, actividad, categorias || [], club_asociado.id);
        
        res.status(201).json({success: true, message: 'Inscripcion programada con exito'});
	});	   

	getAllCuotasInscripcion = asyncHandler(async(req: any, res: Response) => {
        const {club_asociado} = req.user;
		const cuotasInscripcion = await this.inscripcionesApi.getAllCuotasInscripcion(club_asociado.id);
        
        res.status(201).json({success: true, data: cuotasInscripcion});
	});	  

	findInscripcionProgramada = asyncHandler(async(req: any, res: Response) => {
        const {club_asociado} = req.user;
		const {tiposocioid, actividadid} = req.params;
		const cuotasInscripcion = await this.inscripcionesApi.findInscripcionProgramada(tiposocioid, actividadid, club_asociado.id);
        
        res.status(201).json({success: true, data: cuotasInscripcion});
	});	  

	actualizarValorCuotaInscripcion = asyncHandler(async(req: any, res: Response) => {
        const {club_asociado} = req.user;
		const {id} = req.params;
		const{monto} = req.body;
		await this.inscripcionesApi.actualizarValorCuotaInscripcion(id, monto, club_asociado.id);
        
        res.status(201).json({success: true, message: 'Cuota de inscripcion actualizada con exito'});
	});	   

	eliminarCuotaInscripcion = asyncHandler(async(req: any, res: Response) => {
        const {club_asociado} = req.user;
		const {id, tiposocioid, actividadid} = req.params;
		await this.inscripcionesApi.eliminarCuotaInscripcion(parseInt(id), parseInt(actividadid), parseInt(tiposocioid), club_asociado.id);
        
        res.status(201).json({success: true, message: 'Cuota de inscripcion eliminada con exito'});
	});	   

}