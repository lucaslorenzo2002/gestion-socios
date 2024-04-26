import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { TransaccionesApi } from '../services/transacciones.js';
import { SociosApi } from '../services/socios.js';

export class TransaccionesController{
        transaccionesApi: TransaccionesApi;
        sociosApi: SociosApi;
	constructor(){
        this.transaccionesApi = new TransaccionesApi();
        this.sociosApi = new SociosApi();
	}

	iniciarTransaccion = asyncHandler(async(req: any, res: Response) => {
                const {id, club_asociado} = req.user;
                const{motivo, detalles} = req.body;
                await this.transaccionesApi.iniciarTransaccion(id, motivo, JSON.stringify(detalles), club_asociado.id)

                res.status(201).json({success: true, message: `Solicitud para ${motivo} realizada`});
	});

	getTransaccionesPendientesAdmin = asyncHandler(async(req: any, res: Response) => {
                const {club_asociado} = req.user;
                const transacciones = await this.transaccionesApi.getTransaccionesPendientesAdmin(club_asociado.id);

                res.status(201).json({success: true, data: transacciones});
	});	

	getTransaccionesRealizadasAdmin = asyncHandler(async(req: any, res: Response) => {
                const {club_asociado} = req.user;
                const transacciones = await this.transaccionesApi.getTransaccionesRealizadasAdmin(club_asociado.id);

                res.status(201).json({success: true, data: transacciones});
	});

	getTransaccionesSocio = asyncHandler(async(req: any, res: Response) => {
                const {club_asociado, id} = req.user;
                const transacciones = await this.transaccionesApi.getTransaccionesSocio(id, club_asociado.id);

                res.status(201).json({success: true, data: transacciones});
	});	

        getTransaccionSocioByMotivo = asyncHandler(async(req: any, res: Response) => {
                const {id, club_asociado} = req.user;
                const{motivo, actividadid, categoriaid} = req.params;
                const transaccion = await this.transaccionesApi.getTransaccionSocioByMotivo(motivo, id, parseInt(actividadid) || null, parseInt(categoriaid) || null, club_asociado.id);

                res.status(201).json({success: true, data: transaccion});
        });

        getTransaccionById = asyncHandler(async(req: any, res: Response) => {
                const {club_asociado} = req.user;
                const{id} = req.params;
                const transaccion = await this.transaccionesApi.getTransaccionById(id, club_asociado.id);

                res.status(201).json({success: true, data: transaccion});
        });	

        aprobarTransaccion = asyncHandler(async(req: any, res: Response) => {
                const {club_asociado} = req.user;
                const{id} = req.params;
                const{motivo, socioId, detalles} = req.body;
                await this.transaccionesApi.aprobarTransaccion(id, motivo, false, socioId, detalles, club_asociado.id);

                res.status(201).json({success: true, message: "Transaccion aprobada con exito"});
        });	

        rechazarTransaccion = asyncHandler(async(req: any, res: Response) => {
                const {club_asociado} = req.user;
                const{id} = req.params;
                await this.transaccionesApi.rechazarTransaccion(id, club_asociado.id);

                res.status(201).json({success: true, message: "Transaccion rechazada con exito"});
        });
        	
        sociosWithTransaccionesPendientesCuotaInscripcion = asyncHandler(async(req: any, res: Response) => {
                const {club_asociado} = req.user;
                const{tiposocioid, actividadid, categoriaid} = req.params;
                const sociosPendientes = await this.transaccionesApi.sociosWithTransaccionesPendientesCuotaInscripcion(parseInt(tiposocioid) || null, parseInt(actividadid) || null, parseInt(categoriaid) || null, club_asociado.id);
                
                res.status(201).json({success: true, data: sociosPendientes});
        });
        
        eliminarTransaccionesPendientesCuotaInscripcion = asyncHandler(async(req: any, res: Response) => {
                const {club_asociado} = req.user;
                const{ids, tipoSocioId, actividadId, categoriaId} = req.body;
                await this.sociosApi.eliminarSociosDePendiente(ids, tipoSocioId, actividadId, categoriaId, club_asociado.id);

                res.status(201).json({success: true, message: 'Socios eliminados de pendiente con exito'});
        });
}