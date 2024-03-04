import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import {SociosDAO} from '../database/socios.js';
const sociosDAO = new SociosDAO();

export default async(req: Request, res: Response, next: NextFunction) => {

	const {token} = req.cookies;
	if(token){
		try {
			const decoded = jwt.verify(token, 'adsfdcsfeds3w423ewdas') as jwt.JwtPayload;
			req.user = await sociosDAO.getSocioById(decoded.id);
			next();
		} catch (err) {
			res.status(401).json({ error: 'Token inválido', e: err.message });
		}
	} else {
		res.status(401).json({ error: 'Se requiere autenticación' });
	}
};