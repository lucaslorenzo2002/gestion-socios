const Token = require('../models/token');
const logger = require('../utils/logger');

class TokenDAO{

	async findOneTokenByToken(token){
		try{
			return await Token.findOne({
				where: {
					token
				}
			});
		}catch(err){
			logger.info(err);
		}
	}

	async findOneTokenByUser(socioId){
		try{
			return Token.findOne({socio_id: socioId});
		}catch(err){
			logger.info(err);
		}
	}

	async deleteOneToken(socioId){
		try {
			return await Token.destroy({
				where:{
					socio_id: socioId
				}
			});
		} catch (err) {
			logger.info(err);
		}
	}
}

module.exports = TokenDAO;