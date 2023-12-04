const jwt = require('jsonwebtoken');

const AdministradoresDAO = require('../database/administradores');
const administradoresDAO = new AdministradoresDAO();

const adminAuthMiddleware = async(req, res, next) => {

	const {token} = req.cookies;
	if (token) {
		try {
			const decoded = jwt.verify(token, 'adsfdcsfeds3w423ewdas');
			if(decoded.id >= 10000){
				res.status(401).json({ error: 'Solo administrador' });
			}
			req.user = await administradoresDAO.getAdministradorById(decoded.id);
			next();
		} catch (err) {
			res.status(401).json({ error: 'Token inválido', e: err.message });
		}
	} else {
		res.status(401).json({ error: 'require autenticacion' });
	}
};

module.exports = adminAuthMiddleware;