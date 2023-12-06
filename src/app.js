const express = require('express');
const path = require('path');
const passport = require('passport');
const morgan = require('morgan');
const session = require('cookie-session');
const cors = require('cors');
const{ Server: HttpServer } = require('http');
const { ApolloServer } = require('@apollo/server');
const {expressMiddleware} = require('@apollo/server/express4');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

//SETTINGS
const app = express(); 
const httpServer = new HttpServer(app);

require('dotenv').config();
require('./config/passport');

//MIDDLEWARES
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(session({
	cookie:{
		secure: true,
		maxAge:60000
	},
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(fileUpload({
	useTempFiles: true,
	tempFileDir: './uploads'
}));
app.use(cookieParser());
app.use(cors({
	origin: 'http://localhost:5173',
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
	allowedHeaders: ['Access-Control-Allow-Origin', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
	credentials: true
})); 
app.use(passport.initialize());
app.use(passport.session());

//GRAPHQL
const resolvers = require('./graphql/socios/socios.resolvers');
const typeDefs = require('./graphql/socios/socio.type-defs');
const gqlSocioAuthMiddleware = require('./graphql/middlewares/auth');

const apolloServerFunction = async () => {

	const apolloServer = new ApolloServer({
		resolvers: resolvers,
		typeDefs: typeDefs,
		introspection: true
	});
	await apolloServer.start();
	app.use(
		'/graphql',
		//cors<cors.CorsRequest>('http://localhost:5173'),
		express.urlencoded({extended: true}),
		express.json(),
		expressMiddleware(apolloServer, {
			context: async ({ req }) => {
				return await gqlSocioAuthMiddleware(req);
			}
		})
	);
};	

apolloServerFunction();

//ROUTES

const AuthRouter  = require('./routes/auth');
const authRouter = new AuthRouter();
app.use('/api', authRouter.start());

const CuotasRouter  = require('./routes/cuotas');
const cuotasRouter = new CuotasRouter();
app.use('/api', cuotasRouter.start());

const SociosRouter  = require('./routes/socios');
const sociosRouter = new SociosRouter();
app.use('/api', sociosRouter.start());

const PagosRouter  = require('./routes/pagos');
const pagosRouter = new PagosRouter();
app.use('/api', pagosRouter.start());


module.exports = httpServer;