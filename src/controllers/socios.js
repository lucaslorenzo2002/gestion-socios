const asyncHandler = require('express-async-handler');
const SociosApi = require('../services/socios');
const formidable = require('formidable');

class SociosController{
	constructor(){
		this.sociosApi = new SociosApi();
	}

	createSocio = asyncHandler(async(req, res) => {
		try {
			const { nombres, apellido, nroDocumento, tipoDeSocio } = req.body;
			const fileTempFilePath = req.files?.fotoDePerfil?.tempFilePath || null;
			const fileName = req.files?.fotoDePerfil.name || null;
			const fileUrl = req.files ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}` : null;

			await this.sociosApi.createSocio(
				nroDocumento,
				nombres,
				apellido,
				tipoDeSocio,
				req.user.club_asociado,
				fileTempFilePath,
				fileName,
				fileUrl

			);  
			

			res.status(200).json({success: true, message: 'nuevo socio registrado'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	getJugadores = asyncHandler(async(req, res) => {
		try {
			const jugadores = await this.sociosApi.getJugadores(req.user.club_asociado);
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

	darDeBaja = asyncHandler(async(req, res) => {
		try {
			await this.sociosApi.darDeBaja(req.params.socioid);
			res.status(201).json({success: true, message: 'socio dado de baja exitosamente'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

	updateSocioData = asyncHandler(async(req, res) => {
		try {
			const{fecNacimiento, edad, sexo, esJugador, telefonoCelular, codigoPostal, direccion, ciudad, provincia, poseeObraSocial, siglas, rnos, numeroDeAfiliados, denominacionDeObraSocial} = req.body;
			await this.sociosApi.updateSocioData(fecNacimiento, edad, sexo, esJugador, telefonoCelular, codigoPostal, direccion, ciudad, provincia, poseeObraSocial, siglas, rnos, numeroDeAfiliados, denominacionDeObraSocial, req.user.id);
			res.status(201).json({success: true, message: 'datos sincronizados con exito'});
		} catch (err) {
			res.status(500).json({success: false, message: 'hubo un error ' + err.message});
		}
	});	  

}

module.exports = SociosController;
