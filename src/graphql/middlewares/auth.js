const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');

const AdministradoresDAO = require('../../database/administradores');
const administradoresDAO = new AdministradoresDAO();
const SociosDAO = require('../../database/socios');
const sociosDAO = new SociosDAO();

const gqlSocioAuthMiddleware = async(req) => {
	const authorizationHeader = req.headers.authorization;

	if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
		const token = authorizationHeader.split(' ')[1];
		try {
			const decoded = jwt.verify(token, 'adsfdcsfeds3w423ewdas');
			const user = await sociosDAO.getSocioById(decoded.id);
			if(user === null){
				const admin = await administradoresDAO.getAdministradorById(decoded.id);
				return {admin};
			}
			return {user};
		}catch (err) {
			throw new GraphQLError('token invalido' + err.message), {
				extensions: {
					code: 'ERROR',
					http: { status: 400 },
				},
			};	
		}
	}else {
		throw new GraphQLError('User is not authenticated'), {
			extensions: {
				code: 'UNAUTHENTICATED',
				http: { status: 401 },
			},
		};	
	}
};

module.exports = gqlSocioAuthMiddleware;