import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';
import { Club } from './club.js';
import { TipoSocio } from './tipoSocio.js';
import { Actividad } from './actividad.js';
import { CategoriaSocio } from './categoriaSocio.js';
export const Inscripcion = sequelize.define('Inscripcion', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    monto: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    frecuencia_de_abono: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo_de_cuota: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    underscored: true
});
Club.hasMany(Inscripcion, { foreignKey: 'club_asociado_id', sourceKey: 'id' });
Inscripcion.belongsTo(Club, { foreignKey: 'club_asociado_id' });
TipoSocio.hasMany(Inscripcion, { foreignKey: 'tipo_socio_id', sourceKey: 'id' });
Inscripcion.belongsTo(TipoSocio, { foreignKey: 'tipo_socio_id' });
Actividad.hasMany(Inscripcion, { foreignKey: 'actividad_id', sourceKey: 'id' });
Inscripcion.belongsTo(Actividad, { foreignKey: 'actividad_id' });
CategoriaSocio.hasMany(Inscripcion, { foreignKey: 'categoria_id', sourceKey: 'id' });
Inscripcion.belongsTo(CategoriaSocio, { foreignKey: 'categoria_id' });
//# sourceMappingURL=inscripcion.js.map