import asyncHandler from 'express-async-handler';
import { SociosApi } from '../services/socios.js';
export class SociosController {
    constructor() {
        this.createSocio = asyncHandler(async (req, res) => {
            try {
                const { nombres, apellido, id, socioDesde } = req.body;
                const fileTempFilePath = req.files?.fotoDePerfil?.tempFilePath || null;
                const fileName = req.files?.fotoDePerfil.name || null;
                const fileUrl = req.files ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}` : null;
                await this.sociosApi.createSocio(parseInt(id), nombres, apellido, req.user.club_asociado_id, fileTempFilePath, fileName, fileUrl, socioDesde);
                res.status(200).json({ success: true, message: 'nuevo socio registrado' });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'hubo un error ' + err.message });
            }
        });
        this.getSocioById = asyncHandler(async (req, res) => {
            try {
                const socio = await this.sociosApi.getSocioById(parseInt(req.params.id));
                res.status(201).json({ success: true, data: socio });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'hubo un error ' + err.message });
            }
        });
        this.getSocioByIdSocio = asyncHandler(async (req, res) => {
            try {
                const socio = await this.sociosApi.getSocioById(req.user.id);
                res.status(201).json({ success: true, data: socio });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'hubo un error ' + err.message });
            }
        });
        this.darDeBaja = asyncHandler(async (req, res) => {
            try {
                await this.sociosApi.darDeBaja(parseInt(req.params.socioid));
                res.status(201).json({ success: true, message: 'socio dado de baja exitosamente' });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'hubo un error ' + err.message });
            }
        });
        this.darDeAlta = asyncHandler(async (req, res) => {
            try {
                await this.sociosApi.darDeAlta(parseInt(req.params.socioid));
                res.status(201).json({ success: true, message: 'socio activado exitosamente' });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'hubo un error ' + err.message });
            }
        });
        this.updateSocioData = asyncHandler(async (req, res) => {
            try {
                const { fecNacimiento, edad, telefonoCelular, codigoPostal, direccion, ciudad, provincia, poseeObraSocial, siglas, rnos, numeroDeAfiliados, denominacionDeObraSocial } = req.body;
                await this.sociosApi.updateSocioData(fecNacimiento, edad, telefonoCelular, codigoPostal, direccion, ciudad, provincia, poseeObraSocial, siglas, rnos, numeroDeAfiliados, denominacionDeObraSocial, req.user.id);
                res.status(201).json({ success: true, message: 'datos sincronizados con el club' });
            }
            catch (err) {
                console.log(err.message);
                res.status(500).json({ success: false, message: 'hubo un error ' + err.message });
            }
        });
        this.getAllSocios = asyncHandler(async (req, res) => {
            try {
                const socios = await this.sociosApi.getAllSocios(req.user.club_asociado_id);
                res.status(201).json({ success: true, data: socios });
            }
            catch (err) {
                console.log(err.message);
                res.status(500).json({ success: false, message: 'hubo un error ' + err.message });
            }
        });
        this.getAllSociosSinTipoSocio = asyncHandler(async (req, res) => {
            try {
                const socios = await this.sociosApi.getAllSociosSinTipoSocio(req.user.club_asociado_id);
                res.status(201).json({ success: true, data: socios });
            }
            catch (err) {
                console.log(err.message);
                res.status(500).json({ success: false, message: 'hubo un error ' + err.message });
            }
        });
        this.getAllSociosEnTipoSocio = asyncHandler(async (req, res) => {
            try {
                const socios = await this.sociosApi.getAllSociosEnTipoSocio(req.user.club_asociado_id, req.params.tiposocio);
                res.status(201).json({ success: true, data: socios });
            }
            catch (err) {
                console.log(err.message);
                res.status(500).json({ success: false, message: 'hubo un error ' + err.message });
            }
        });
        this.getSocioDeuda = asyncHandler(async (req, res) => {
            try {
                const socioDeuda = await this.sociosApi.getSocioDeuda(parseInt(req.params.id));
                res.status(201).json({ success: true, data: socioDeuda });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'hubo un error ' + err.message });
            }
        });
        this.eliminarSocioDeTipoDeSocio = asyncHandler(async (req, res) => {
            try {
                const { ids, tipoSocio } = req.body;
                const { tiposocioid } = req.params;
                await this.sociosApi.eliminarSocioDeTipoDeSocio(ids, tiposocioid, req.user.club_asociado_id);
                res.status(201).json({ success: true, message: `Socios de ${tipoSocio} actualizados` });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'hubo un error ' + err.message });
            }
        });
        this.agregarSocioATipoDeSocio = asyncHandler(async (req, res) => {
            try {
                const { ids, tipoSocio } = req.body;
                const { tiposocioid } = req.params;
                await this.sociosApi.agregarSocioATipoDeSocio(ids, tiposocioid, req.user.club_asociado_id);
                res.status(201).json({ success: true, message: `Socios agregados a ${tipoSocio} con exito` });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'hubo un error ' + err.message });
            }
        });
        this.filterSocios = asyncHandler(async (req, res) => {
            try {
                const sociosFiltrados = await this.sociosApi.filterSocios(req.body.tipoSocio, req.body.categoria, req.body.actividades, req.user.club_asociado_id);
                res.status(201).json({ success: true, data: sociosFiltrados });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'hubo un error ' + err.message });
            }
        });
        this.getAllSociosWithEmail = asyncHandler(async (req, res) => {
            const { club_asociado } = req.user;
            const sociosFiltrados = await this.sociosApi.getAllSociosWithEmail(club_asociado.id);
            res.status(201).json({ success: true, data: sociosFiltrados });
        });
        this.sociosApi = new SociosApi();
    }
}
//# sourceMappingURL=socios.js.map