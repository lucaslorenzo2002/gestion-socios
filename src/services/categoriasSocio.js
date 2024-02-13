const CategoriasSocioDAO = require('../database/categoriasSocio');

class CateogriasSocioApi{
	constructor(){
		this.categoriasSocioDAO = new CategoriasSocioDAO();
	}

	async createCategoriaSocio(categoria, club, actividadId){
		return await this.categoriasSocioDAO.createCategoriaSocio({categoria, club, actividad_id: actividadId});
	}

	async getCategoriasActividad(club, actividadId){
		return await this.categoriasSocioDAO.getCategoriasActividad(club, actividadId);
	}

	async getAllCategorias(club){
		return await this.categoriasSocioDAO.getAllCategorias(club);
	}

	async categoriasDeSocioConCuotasCreadas(club){
		return await this.categoriasSocioDAO.categoriasDeSocioConCuotasCreadas(club);
	}
}

module.exports = CateogriasSocioApi;