import { ActividadesDAO } from '../database/actividades.js';
import { CategoriasSocioDAO } from '../database/categoriasSocio.js';
import { SociosDAO } from '../database/socios.js';
import { TransaccionesDAO } from '../database/transacciones.js';
import { transaccionesEnum } from '../enums/transacciones.js';
import { BadRequestError } from '../errors/bad-request-error.js';
import { IActividadSocio } from '../interfaces/IActividadSocio.js';
import { ICategoriaSocioSocio } from '../interfaces/ICategoriaSocioSocio.js';

export class TransaccionesApi{
    transaccionesDAO: TransaccionesDAO;
    sociosDAO: SociosDAO;
    actividadesDAO: ActividadesDAO;
    categoriasSocioDAO: CategoriasSocioDAO;
	constructor(){
		this.transaccionesDAO = new TransaccionesDAO();
		this.sociosDAO = new SociosDAO();
        this.actividadesDAO = new ActividadesDAO();
        this.categoriasSocioDAO = new CategoriasSocioDAO()
	}

    async iniciarTransaccion(socioId: number, motivo: string, detalles: string, clubAsociadoId: number){
        try {
            if(!motivo){
                throw new BadRequestError('Sin motivo especificado')
            }
    
            if(!detalles){
                throw new BadRequestError('Sin detalles especificados')
            }
            
            return await this.transaccionesDAO.iniciarTransaccion(socioId, motivo, detalles, clubAsociadoId);
        } catch (error) {
            console.log(error)
            throw new BadRequestError(error.BadRequestError)
        }
	}

    async aprobarTransaccion(id: number, motivo: string, poseeCategoria: boolean, socioId: number, detalles: string, clubAsociadoId: number){
        if(motivo === transaccionesEnum.adherirseDebitoAutomatico){
            await this.sociosDAO.adherirSocioAlDebitoAutomatico(socioId, clubAsociadoId);

            //llamada al servicio de pagos
        }
        
        if(motivo === transaccionesEnum.inscripcionSocial){
            const detallesParsed = JSON.parse(detalles);
            await this.sociosDAO.agregarSocioATipoDeSocio(socioId, detallesParsed.tipoSocioId, clubAsociadoId);
        }

        if(motivo === transaccionesEnum.inscripcionDeportiva && poseeCategoria){
            const detallesParsed = JSON.parse(detalles);
            
            await this.categoriasSocioDAO.createCategoriaSocioAndActividad(
                {
                    socio_id: socioId,
                    actividad_id: detallesParsed.actividadId,
                    categoria_socio_id: detallesParsed.categoriaId,
                    club_asociado_id: clubAsociadoId
                } as ICategoriaSocioSocio,
                {
                    socio_id: socioId,
				    actividad_id: detallesParsed.actividadId,
				    club_asociado_id: clubAsociadoId
                } as IActividadSocio,
                detallesParsed.categoriaId
            )
        }

        if(motivo === transaccionesEnum.inscripcionDeportiva && !poseeCategoria){
            const detallesParsed = JSON.parse(detalles);
            await this.actividadesDAO.crearSocioActividad(
                {
                socio_id: socioId,
				actividad_id: detallesParsed.actividadId,
				club_asociado_id: clubAsociadoId
                } as IActividadSocio, 
                detallesParsed.actividadId
            )
        }

        await this.transaccionesDAO.aprobarTransaccion(id, clubAsociadoId);
    }

    async rechazarTransaccion(id: number, clubAsociadoId: number){
        return await this.transaccionesDAO.rechazarTransaccion(id, clubAsociadoId)
    }

    async getTransaccionesPendientesAdmin(clubAsociado: number){
        return await this.transaccionesDAO.getTransaccionesPendientesAdmin(clubAsociado)
    }

    async getTransaccionesRealizadasAdmin(clubAsociado: number){
        return await this.transaccionesDAO.getTransaccionesRealizadasAdmin(clubAsociado)
    }

    async getTransaccionesSocio(socioId: number, clubAsociadoId: number){
        return await this.transaccionesDAO.getTransaccionesSocio(socioId, clubAsociadoId)
    }

    async getTransaccionSocioByMotivo(motivo: string, socioId: number, actividadId: number, categoriaId: number, clubAsociadoId: number){
        return await this.transaccionesDAO.getTransaccionSocioByMotivo(motivo, socioId, actividadId, categoriaId, clubAsociadoId)
    }

    async getTransaccionById(id: number, clubAsociadoId: number){
        const transaccion = await this.transaccionesDAO.getTransaccionById(id, clubAsociadoId);
        return {
            motivo: transaccion.dataValues.motivo,
            detalles: JSON.parse(transaccion.dataValues.detalles)
        }
    }

    async eliminarTransaccion(id: number){
        return await this.transaccionesDAO.eliminarTransaccion(id);
    }

    async eliminarAllTransaccionesByMotivo(motivo: string, actividadId: number, categoriaId: number, clubAsociadoId: number){
        return await this.transaccionesDAO.eliminarAllTransaccionesByMotivo(motivo, actividadId, categoriaId, clubAsociadoId);
    }

    async sociosWithTransaccionesPendientesCuotaInscripcion(tipoSocioId: number, actividadId: number, categoriaId: number, clubAsociadoId: number){
        return await this.transaccionesDAO.sociosWithTransaccionesPendientesCuotaInscripcion(tipoSocioId, actividadId, categoriaId, clubAsociadoId);
    }
}
