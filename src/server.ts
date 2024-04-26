import httpServer from './app.js';
import cluster from 'cluster';
import os from 'os';
import logger from './utils/logger.js';
import sequelize from './config/sequelizeConfig.js';
import {client} from './config/redisConfig.js';
/* require('./src/models/socio');
require('./src/models/cuota');
require('./src/models/actividad');
require('./src/models/administrador');
require('./src/models/socio_cuota');
require('./src/models/actividad_socio');
require('./src/models/club');
 */

async function server (){
	const numCpus = os.cpus().length;
	
	if(cluster.isPrimary){
		logger.info(numCpus);
		logger.info(process.pid);

		for(let i = 0; i < numCpus; i++){
			cluster.fork();
		}
    
		cluster.on('exit', worker => {
			logger.info(worker.process.pid);
			cluster.fork();
		});
	}else{ 
		await sequelize.sync({alter: true}).then(() => {
			logger.info('All models were synchronized successfully.');
		}).catch((err: Error) => {
			logger.info(err.message);
		});

		client.on('error', err => logger.info('Redis Client Error', err.message));

		/* await client.connect().then(() => {
			logger.info('Redis successfuly running');
		}).catch((err: Error) => {
			logger.info(err.message);
		});; */

		const PORT = process.env.PORT || 4000;

		const server = httpServer.listen(PORT, () => {
			logger.info(`App listening on port ${PORT}`);
		});

		server.on('error', err => logger.info(err.message));
	} 
}

server();