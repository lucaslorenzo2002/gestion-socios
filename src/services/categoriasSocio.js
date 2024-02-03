const CategoriasSocioDAO = require('../database/categoriasSocio');

class CateogriasSocioApi{
	constructor(){
		this.categoriasSocioDAO = new CategoriasSocioDAO();
	}

	async createCategoriaSocio(categoria, club){
		return await this.categoriasSocioDAO.createCategoriaSocio({categoria, club});
	}

	async getCategoriasSocio(club){
		return await this.categoriasSocioDAO.getCategoriasSocio(club);
	}

	async categoriasDeSocioConCuotasCreadas(club){
		return await this.categoriasSocioDAO.categoriasDeSocioConCuotasCreadas(club);
	}
}

module.exports = CateogriasSocioApi;