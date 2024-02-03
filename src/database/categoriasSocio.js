const CategoriaSocio = require('../models/categoriaSocio');
const CuotaProgramada = require('../models/cuotaProgramada');
const logger = require('../utils/logger');

class CategoriasSocioDAO{

	async createCategoriaSocio(newCategoriaSocio){
		try{
			return await CategoriaSocio.create(newCategoriaSocio);
		}catch(err){
			logger.info(err);
		}
	}

	async getCategoriasSocio(club){
		try{
			return await CategoriaSocio.findAll({
				attributes: ['categoria', 'id'],
				where: {
					club
				}
			});
		}catch(err){
			logger.info(err);
		}
	}

	async categoriasDeSocioConCuotasCreadas(club){
		try {
			const categorias = await CategoriaSocio.findAll({
				attributes: ['categoria'],
				where: {
					club
				}
			});
			const categoriasConCuotas = [];
			const categoriasSinCuotas = [];

			for (let i = 0; i < categorias.length; i++) {
				const cuota = await CuotaProgramada.findOne({
					where:{
						to: categorias[i].dataValues.categoria
					}
				});
				if(cuota){
					categoriasConCuotas.push(categorias[i].dataValues.categoria);
				}else{
					categoriasSinCuotas.push(categorias[i].dataValues.categoria);
				}
			}

			return [categoriasConCuotas, categoriasSinCuotas];
		} catch (err) {
			logger.info(err);
		}
	}

}

module.exports = CategoriasSocioDAO;