const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');
const Socio = require('./socio');
const Actividad = require('./actividad');

const Actividad_Socio = sequelize.define('Actividad_Socio', {
	id:{
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	}
}, { 
	underscored: true,
	timestamps: false 
});

Socio.belongsToMany(Actividad, { through: Actividad_Socio, foreignKey: 'socio_id' });
Actividad.belongsToMany(Socio, { through: Actividad_Socio, foreignKey: 'actividad_id' });
Actividad_Socio.belongsTo(Socio);


Actividad_Socio.sync({ alter: true })
	.then(() => {
		console.log('La tabla Actividad_Socio ha sido creada correctamente');
	})
	.catch(err => {
		console.error('Error al crear la tabla Actividad_Socio:', err.message);
	});

module.exports = Actividad_Socio;