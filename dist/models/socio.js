import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';
import { Token } from './token.js';
import { CategoriaSocio } from './categoriaSocio.js';
import { TipoSocio } from './tipoSocio.js';
import { Club } from './club.js';
import { Actividad } from './actividad.js';
export const Socio = sequelize.define('Socio', {
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
    password: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    fec_nacimiento: {
        type: DataTypes.DATE,
    },
    edad: {
        type: DataTypes.INTEGER
    },
    foto_de_perfil: DataTypes.STRING,
    estado_socio: {
        type: DataTypes.STRING,
        defaultValue: 'ACTIVO'
    },
    meses_abonados_cuota_deporte: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    meses_abonados_cuota_social: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    tipo_doc: {
        type: DataTypes.STRING
    },
    socio_desde: {
        type: DataTypes.DATE
    },
    sexo: {
        type: DataTypes.STRING
    },
    telefono_celular: {
        type: DataTypes.STRING
    },
    deuda: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.00
    },
    codigo_postal: {
        type: DataTypes.INTEGER
    },
    direccion: {
        type: DataTypes.STRING
    },
    ciudad: {
        type: DataTypes.STRING
    },
    provincia: {
        type: DataTypes.STRING
    },
    posee_obra_social: {
        type: DataTypes.BOOLEAN
    },
    siglas: {
        type: DataTypes.STRING
    },
    rnos: {
        type: DataTypes.STRING
    },
    numero_de_afiliados: {
        type: DataTypes.INTEGER
    },
    denominacion_de_obra_social: {
        type: DataTypes.STRING
    },
    validado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    perfil_completado: {
        type: DataTypes.INTEGER,
    }
}, {
    underscored: true
});
Socio.sync();
Socio.hasOne(Token, { foreignKey: 'socio_id', sourceKey: 'id' });
Token.belongsTo(Socio, { foreignKey: 'socio_id' });
TipoSocio.hasMany(Socio, { foreignKey: 'tipo_socio_id', sourceKey: 'id' });
Socio.belongsTo(TipoSocio, { foreignKey: 'tipo_socio_id', as: 'tipo_socio' });
Club.hasMany(Socio, { foreignKey: 'club_asociado_id', sourceKey: 'id' });
Socio.belongsTo(Club, { foreignKey: 'club_asociado_id', as: 'club_asociado' });
Actividad.hasMany(Socio, { foreignKey: 'actividad_id', sourceKey: 'id' });
Socio.belongsTo(Actividad, { foreignKey: 'actividad_id', as: 'activ' });
CategoriaSocio.hasMany(Socio, { foreignKey: 'categoria_id', sourceKey: 'id' });
Socio.belongsTo(CategoriaSocio, { foreignKey: 'categoria_id', as: 'cat' });
//# sourceMappingURL=socio.js.map