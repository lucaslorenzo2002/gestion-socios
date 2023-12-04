const CuotasApi = require('../../services/cuotas');
const cuotasApi = new CuotasApi();
  
const cuotasResolvers = {
	Query: {
		getMisCuotas: async(parent, args, context) => {
			return await cuotasApi.getMisCuotas(context.user.id);
		},
		getCuota: async(parent, args, context) => {
			const {id} = args;
			return await cuotasApi.getCuota(id);
		},
		getAllCuotas: async(parent, args, context) => {
			return await cuotasApi.getAllCuotas(context.admin.dataValues.club_asociado);
		}
	}
};

module.exports = cuotasResolvers;
