const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');
const Token = require('./token');
const Notificacion = require('./notificacion');

const Socio = sequelize.define('Socio',{
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	apellido: {
		type: DataTypes.STRING,
		allowNull: false
	},
	nombres: {
		type: DataTypes.STRING,
		allowNull: false
	},
	password:{
		type: DataTypes.STRING
	},
	email:{
		type: DataTypes.STRING
	},
	//LA FEC NACIMIENTO PODRIA DETERMINAR EL TIPO DE SOCIO
	fec_nacimiento:{
		type: DataTypes.DATE,
	},
	edad:{
		type: DataTypes.INTEGER
	},
	foto_de_perfil: DataTypes.STRING,
	tipo_de_grupo:{
		type: DataTypes.STRING
	},
	tipo_socio:{
		type: DataTypes.STRING,
		allowNull: false
	},
	//LO TIENE QUE DEFINIR EL ADMIN
	estado_socio:{
		type: DataTypes.STRING,
		defaultValue: 'ACTIVO'
	},
	tipo_doc:{
		type: DataTypes.STRING
	},
	nro_documento: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true
	},
	sexo:{
		type: DataTypes.STRING
	},
	es_jugador:{
		type: DataTypes.BOOLEAN,
		defaultValue: false
	},
	telefono_fijo:{
		type: DataTypes.STRING
	},
	telefono_celular:{
		type: DataTypes.STRING
	},
	deuda:{
		type: DataTypes.INTEGER,
		defaultValue: 0
	},
	club_asociado:{
		type: DataTypes.STRING,
		allowNull: false
	},
	codigo_postal:{
		type: DataTypes.INTEGER
	},
	direccion:{
		type: DataTypes.STRING
	},
	ciudad:{
		type: DataTypes.STRING
	},
	provincia:{
		type: DataTypes.STRING
	},
	posee_obra_social:{
		type: DataTypes.BOOLEAN
	},
	siglas:{
		type: DataTypes.STRING
	},
	rnos:{
		type: DataTypes.STRING
	},
	numero_de_afiliados:{
		type: DataTypes.INTEGER
	},
	denominacion_de_obra_social:{
		type: DataTypes.INTEGER
	},
	validado: {
		type: DataTypes.BOOLEAN,
		defaultValue: false
	},
	perfil_completado:{
		type: DataTypes.INTEGER,
	}
}, {

	underscored: true
},
);

Socio.sync().then(() => {
	return sequelize.query('ALTER SEQUENCE "socios_id_seq" RESTART WITH 10000;');
});

Socio.hasOne(Token, {foreignKey: 'socio_nro_documento', sourceKey: 'nro_documento'});
Token.belongsTo(Socio, {foreignKey: 'socio_nro_documento', sourceKey: 'nro_documento'});

Socio.hasOne(Notificacion, {foreignKey: 'socio_id', sourceKey: 'id'});
Notificacion.belongsTo(Socio, {foreignKey: 'socio_id', sourceKey: 'id'});

module.exports = Socio;