const ActividadesDAO = require('../database/actividades');

class ActividadesApi{
	constructor(){
		this.actividadesDAO = new ActividadesDAO();
	}

	async createActividad(actividad, club){
		//no me genera el id automaticamente, entoces lo creo de forma aleatoria
		return await this.actividadesDAO.crearActividad({actividad, club, id: Math.floor(Math.random() * 100000) + 1});
	}

	async createSocioActividad(socioId, actividades, categorias){
		if(Array.isArray(actividades)){
			for (let i = 0; i < actividades.length; i++) {
				await this.actividadesDAO.crearSocioActividad({socio_id: socioId, actividad_id: parseInt(actividades[i]), categoria_socio_id: categorias});
			} 
		}else{
			console.log(socioId, actividades);
			return await this.actividadesDAO.crearSocioActividad({socio_id: socioId, actividad_id: actividades, categoria_socio_id: categorias});
		}
	}

	async eliminarSocioActividad(socioId){
		return await this.actividadesDAO.eliminarSocioActividad(socioId);
	}

	async getActividades(club){
		return await this.actividadesDAO.getActividades(club);
	}

	async getSocioActividad(idSocio){
		return await this.actividadesDAO.getSocioActividad(idSocio);
	}

	async eliminarActividad(id, club){
		return await this.actividadesDAO.eliminarActividad(id, club);
	}
}

module.exports = ActividadesApi;