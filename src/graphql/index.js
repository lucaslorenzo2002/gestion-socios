const { mergeTypeDefs } = require('@graphql-tools/merge');
const { mergeResolvers } = require('@graphql-tools/merge');
const socioType = require('./socios/socio.type-defs.js');
const socioResolvers = require('./socios/socio.resolvers.js');
const cuotasType = require('./cuotas/cuotas.type-defs.js');
const cuotasResolvers = require('./cuotas/cuotas.resolvers.js');

const typeDefs = mergeTypeDefs([socioType, cuotasType]);
const resolvers = mergeResolvers([socioResolvers, cuotasResolvers]);

module.exports = {
	typeDefs,
	resolvers,
};
