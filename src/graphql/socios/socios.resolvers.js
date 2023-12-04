const SociosApi = require('../../services/socios');
const sociosApi = new SociosApi();
  
const sociosResolvers = {
	Query: {
		getSocioById: async(parent, args, context) => {
			return await sociosApi.getSocioById(context.user.id);
		},
		getSocioByIdAdmin: async(parent, args, context) => {
			return await sociosApi.getSocioById(context.user.id);
		},
		getAllSocios: async(parent, args, context) => {
			return await sociosApi.getAllSocios(context.admin.dataValues.club_asociado);
		},
	}
};

module.exports = sociosResolvers;
