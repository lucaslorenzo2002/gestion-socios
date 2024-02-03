const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeConfig');
const Token = require('./token');
const CategoriaSocio = require('./categoriaSocio');
const TipoSocio = require('./tipoSocio');
const Club = require('./club');
const Administrador = require('./administrador');
const Cuota = require('./cuota');
const CuotaProgramada = require('./cuotaProgramada');

const Socio = sequelize.define('Socio',{
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		allowNull: false,
		unique: true
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
	//LO TIENE QUE DEFINIR EL ADMIN
	estado_socio:{
		type: DataTypes.STRING,
		defaultValue: 'ACTIVO'
	},
	tipo_doc:{
		type: DataTypes.STRING
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

Socio.sync();

Socio.hasOne(Token, {foreignKey: 'socio_id', sourceKey: 'id'});
Token.belongsTo(Socio, {foreignKey: 'socio_id', sourceKey: 'id'});

TipoSocio.hasMany(Socio, {foreignKey: 'tipo_socio_id', sourceKey: 'id'});
Socio.belongsTo(TipoSocio, {foreignKey: 'tipo_socio_id', sourceKey: 'id', as: 'tipo_socio'});

CategoriaSocio.hasMany(Socio, {foreignKey: 'categoria_socio_id', sourceKey: 'id'});
Socio.belongsTo(CategoriaSocio, {foreignKey: 'categoria_socio_id', sourceKey: 'id', as: 'categoria'});

Club.hasMany(Socio, {foreignKey: 'club_asociado_id', sourceKey: 'id'});
Socio.belongsTo(Club, {foreignKey: 'club_asociado_id', sourceKey: 'id', as: 'club_asociado'});

Club.hasMany(Administrador, {foreignKey: 'club_asociado_id', sourceKey: 'id'});
Administrador.belongsTo(Club, {foreignKey: 'club_asociado_id', sourceKey: 'id', as: 'club_asociado'});

Club.hasMany(Cuota, {foreignKey: 'club_asociado_id', sourceKey: 'id'});
Cuota.belongsTo(Club, {foreignKey: 'club_asociado_id', sourceKey: 'id', as: 'club_asociado'});

Club.hasMany(CuotaProgramada, {foreignKey: 'club_asociado_id', sourceKey: 'id'});
CuotaProgramada.belongsTo(Club, {foreignKey: 'club_asociado_id', sourceKey: 'id', as: 'club_asociado'});


module.exports = Socio;