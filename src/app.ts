import express from 'express';
import path from 'path';
import passport from 'passport';
import morgan from 'morgan';
import session from 'cookie-session';
import cors from 'cors';
import { Server as HttpServer } from 'http';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import exphbs from 'express-handlebars';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

//SETTINGS
const app = express(); 
const httpServer = new HttpServer(app);
dotenv.config()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import './config/passport.js';

//MIDDLEWARES
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan('dev'));
app.use(session({
	secret: 'secret'
}));
app.use(fileUpload({
	useTempFiles: true,
	tempFileDir: './uploads'
}));
app.use(cookieParser());
app.use(cors({
	origin: ['https://65e70e73a596689b35a227d3--extraordinary-sundae-24a1ed.netlify.app/', 'http://localhost:5174'],
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
	allowedHeaders: ['Access-Control-Allow-Origin', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
	credentials: true
})); 
app.use(passport.initialize());
app.use(passport.session());
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs.engine({
	layoutsDir: path.join(app.get('views'), 'layouts')
}));
app.set('view engine', 'handlebars');

//ROUTES

import {AuthRouter} from './routes/auth.js';
const authRouter = new AuthRouter();
app.use('/api', authRouter.start());

import {CuotasRouter} from './routes/cuotas.js';
const cuotasRouter = new CuotasRouter();
app.use('/api', cuotasRouter.start());

import {SociosRouter} from './routes/socios.js';
const sociosRouter = new SociosRouter();
app.use('/api', sociosRouter.start());

import {PagosRouter} from './routes/pagos.js';
const pagosRouter = new PagosRouter();
app.use('/api', pagosRouter.start());

import {CategoriasSocioRouter} from './routes/categoriasSocio.js';
const categoriasSocioRouter = new CategoriasSocioRouter();
app.use('/api', categoriasSocioRouter.start());

import {ActividadesRouter} from './routes/actividades.js';
const actividadesRouter = new ActividadesRouter();
app.use('/api', actividadesRouter.start());

import {TiposSocioRouter} from './routes/tiposSocio.js';
const tiposSocioRouter = new TiposSocioRouter();
app.use('/api', tiposSocioRouter.start());

export default httpServer;