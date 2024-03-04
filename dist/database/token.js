import { Token /* , buildToken */ } from '../models/token.js';
import logger from '../utils/logger.js';
export class TokenDAO {
    async createToken(socioId, token) {
        try {
            return await Token.create({
                socio_id: socioId,
                token
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async findOneTokenByToken(token) {
        try {
            return await Token.findOne({
                where: {
                    token
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async findOneTokenByUser(socioId) {
        try {
            return Token.findOne({
                where: {
                    socio_id: socioId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
    async deleteOneToken(socioId) {
        try {
            return await Token.destroy({
                where: {
                    socio_id: socioId
                }
            });
        }
        catch (err) {
            logger.info(err);
        }
    }
}
//# sourceMappingURL=token.js.map