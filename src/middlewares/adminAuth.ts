import jwt from 'jsonwebtoken';

import {AdministradoresDAO} from '../database/administradores.js';
import { NextFunction, Request, Response } from 'express';
const administradoresDAO = new AdministradoresDAO();

export default async(req: Request, res: Response, next: NextFunction) => {

	const {token} = req.cookies;
	if (token) {
		try {
			const decoded = jwt.verify(token, 'adsfdcsfeds3w423ewdas') as jwt.JwtPayload;
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