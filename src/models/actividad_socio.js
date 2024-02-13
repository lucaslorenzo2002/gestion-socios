const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');
const Socio = require('./socio');
const Actividad = require('./actividad');
const CategoriaSocio = require('./categoriaSocio');

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
Actividad_Socio.belongsTo(Actividad);
CategoriaSocio.hasMany(Actividad_Socio, {foreignKey: 'categoria_socio_id', sourceKey: 'id'});
Actividad_Socio.belongsTo(CategoriaSocio, {foreignKey: 'categoria_socio_id', sourceKey: 'id'});


module.exports = Actividad_Socio;

