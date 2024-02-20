const asyncHandler = require('express-async-handler');
const SociosApi = require('../services/socios');
const ActividadesApi = require('../services/actividades');

class SociosController{
	constructor(){
		this.sociosApi = new SociosApi();
		this.actividadesApi = new ActividadesApi();
	}

	createSocio = asyncHandler(async(req, res) => {
		try {
			const { nombres, apellido, id, categoria, tipoSocio, actividades, socioDesde } = req.body;
			const fileTempFilePath = req.files?.fotoDePerfil?.tempFilePath || null;
			const fileName = req.files?.fotoDePerfil.name || null;
			const fileUrl = req.files ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}` : null;
		
			await this.sociosApi.createSocio(
				parseInt(id),
				nombres,
				apellido,
				parseInt(categoria),
				req.user.club_asociado_id,
				fileTempFilePath,
				fileName,
				fileUrl,
				parseInt(tipoSocio),
				parseInt(actividades),
				socioDesde
			);

			res.status(200).json({success: true, message: 'nuevo socio registrado'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getJugadores = asyncHandler(async(req, res) => {
		try {
			const jugadores = await this.sociosApi.getJugadores(req.user.club_asociado_id);
			res.status(201).json({success: true, data: jugadores});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err});
		}
	});	  

	getSocioById = asyncHandler(async(req, res) => {
		try {
			const socio = await this.sociosApi.getSocioById(req.params.id);
			res.status(201).json({success: true, data: socio});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getSocioByIdSocio = asyncHandler(async(req, res) => {
		try {
			const socio = await this.sociosApi.getSocioById(req.user.id);
			res.status(201).json({success: true, data: socio});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	darDeBaja = asyncHandler(async(req, res) => {
		try {
			await this.sociosApi.darDeBaja(req.params.socioid);
			res.status(201).json({success: true, message: 'socio dado de baja exitosamente'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	darDeAlta = asyncHandler(async(req, res) => {
		try {
			await this.sociosApi.darDeAlta(req.params.socioid);
			res.status(201).json({success: true, message: 'socio activado exitosamente'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	updateSocioData = asyncHandler(async(req, res) => {
		try {
			const{fecNacimiento, edad, telefonoCelular, codigoPostal, direccion, ciudad, provincia, poseeObraSocial, siglas, rnos, numeroDeAfiliados, denominacionDeObraSocial} = req.body;
			await this.sociosApi.updateSocioData(fecNacimiento, edad, telefonoCelular, codigoPostal, direccion, ciudad, provincia, poseeObraSocial, siglas, rnos, numeroDeAfiliados, denominacionDeObraSocial, req.user.id);
			res.status(201).json({success: true, message: 'datos sincronizados con el club'});
		} catch (err) {
			console.log(err.message);
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getAllSocios = asyncHandler(async(req, res) => {
		try {
			const socios = await this.sociosApi.getAllSocios(req.user.club_asociado_id);
			res.status(201).json({success: true, data: socios});
		} catch (err) {
			console.log(err.message);
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	

	getSocioDeuda = asyncHandler(async(req, res) => {
		try {
			const socioDeuda = await this.sociosApi.getSocioDeuda(req.params.id);
			res.status(201).json({success: true, data: socioDeuda});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	

	actualizarCategoriaDeSocio = asyncHandler(async(req, res) => {
		try {
			await this.sociosApi.actualizarCategoriaDeSocio(req.body.id, parseInt(req.body.categoria), req.user.club_asociado_id);
			res.status(201).json({success: true, message: 'la categoria del socio ha sido actualizada'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	 

	actualizarTipoSocio = asyncHandler(async(req, res) => {
		try {
			await this.sociosApi.actualizarTipoSocio(req.body.id, parseInt(req.body.tipoSocio), req.user.club_asociado_id);
			res.status(201).json({success: true, message: 'el tipo de socio ha sido actualizado'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	 

	actualizarActividadesSocio = asyncHandler(async(req, res) => {
		try {
			await this.sociosApi.actualizarActividadesSocio(req.body.id, parseInt(req.body.actividades), req.user.club_asociado_id);
			res.status(201).json({success: true, message: 'las actividades del socio han sido actualizadas'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	 

	filterSocios = asyncHandler(async(req, res) => {
		try {
			const sociosFiltrados = await this.sociosApi.filterSocios(req.body.tipoSocio, req.body.categoria, req.body.actividades, req.user.club_asociado_id);
			res.status(201).json({success: true, data: sociosFiltrados});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	 

}

module.exports = SociosController;
