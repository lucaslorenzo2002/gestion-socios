import {Administrador} from '../models/administrador.js';
import { Club } from '../models/club.js';
import logger from '../utils/logger.js';
import {IncludeOptions} from './includeOptions.js';

export class AdministradoresDAO{
	getAdminIncludeOptions: IncludeOptions;

	constructor(){
		this.getAdminIncludeOptions = new IncludeOptions;
	}

	async crearAdministradorTest(){
		try {
			return await Administrador.create({
				codigo_administrador: '0303200204',
				club_asociado_id: 1,
				mercado_pago_access_token: '32231231232',
			})
		} catch (err) {
			logger.info(err);
		}
	}

	async crearClubTest(){
		try {
			console.log('hola')
			console.log(Club)
			return await Club.create({
				nombre: 'porteno',
				id: 1,
				plan: 'basico',
			})
		} catch (err) {
			logger.info(err);
		}
	}

	async findAdministradorByCodigo(codigoAdministrador: number){
		try{
			return Administrador.findOne({
				include: this.getAdminIncludeOptions.getAdminIncludeOptions(),
				where: {
					codigo_administrador: codigoAdministrador
				}
			});
		}catch(err){
			logger.info(err);
		}
	}

	async getAdministradorById(id: number){
		try{
			return Administrador.findOne({
				include: this.getAdminIncludeOptions.getAdminIncludeOptions(),
				where: {
					id
				}
			});
		}catch(err){
			logger.info(err);
		}
	}

	async getAdministradorByClubAsociado(clubAsociado: number){
		try{
			return Administrador.findOne({
				include: this.getAdminIncludeOptions.getAdminIncludeOptions(),
				where: {
					club_asociado_id: clubAsociado
				}
			});
		}catch(err){
			logger.info(err);
		}
	}
}
