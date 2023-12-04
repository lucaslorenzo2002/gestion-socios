const jwt = require('jsonwebtoken');

const SociosDAO = require('../database/socios');
const sociosDAO = new SociosDAO();

const socioAuthMiddleware = async(req, res, next) => {
	
	const {token} = req.cookies;
	if(token){
		try {
			const decoded = jwt.verify(token, 'adsfdcsfeds3w423ewdas');
			req.user = await sociosDAO.getSocioById(decoded.id);
			next();
		} catch (err) {
			res.status(401).json({ error: 'Token inválido', e: err.message });
		}
	} else {
		res.status(401).json({ error: 'Se requiere autenticación' });
	}
};

module.exports = socioAuthMiddleware;