import { app } from "../app.js";
import sqlite3 from 'sqlite3';
import sequelize from '../config/sequelizeConfig.js';
import request from 'supertest';
import { Club } from "../models/club.js";
import { Administrador } from "../models/administrador.js";

declare global {
    var signin: () => Promise<any>;
}

beforeAll(async () => {
    await sequelize.authenticate()
    await sequelize.sync({force: true})
    await Club.create({
        nombre: 'porteno',
		id: 1,
		plan: 'basico'
    });
    
    await Administrador.create({
        codigo_administrador: '0303200204',
		club_asociado_id: 1,
		mercado_pago_access_token: '32231231232'
    });
    await global.signin()
});

afterAll(async () => {
    await sequelize.close()
})

global.signin = async() => {
    const agent = request.agent(app); 

    await agent
        .post('/api/loginadmin')
        .send({
            codigoAdministrador: '0303200204'
        })
        .expect(201);
    return agent;
}