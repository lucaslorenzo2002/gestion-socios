import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';
import { CuotaProgramada } from './cuotaProgramada.js';
import { Club } from './club.js';
import { TipoSocio } from './tipoSocio.js';
import { Actividad } from './actividad.js';
import { CategoriaSocio } from './categoriaSocio.js';
export const Cuota = sequelize.define('Cuota', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    monto: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    tipo_de_cuota: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_emision: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_vencimiento: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    underscored: true
});
CuotaProgramada.hasMany(Cuota, { foreignKey: 'cuota_programada_id', sourceKey: 'id' });
Cuota.belongsTo(CuotaProgramada, { foreignKey: 'cuota_programada_id' });
Club.hasMany(Cuota, { foreignKey: 'club_asociado_id', sourceKey: 'id' });
Cuota.belongsTo(Club, { foreignKey: 'club_asociado_id' });
TipoSocio.hasMany(Cuota, { foreignKey: 'tipo_socio_id', sourceKey: 'id' });
Cuota.belongsTo(TipoSocio, { foreignKey: 'tipo_socio_id' });
Actividad.hasMany(Cuota, { foreignKey: 'actividad_id', sourceKey: 'id' });
Cuota.belongsTo(Actividad, { foreignKey: 'actividad_id' });
CategoriaSocio.hasMany(Cuota, { foreignKey: 'categoria_id', sourceKey: 'id' });
Cuota.belongsTo(CategoriaSocio, { foreignKey: 'categoria_id' });
//# sourceMappingURL=cuota.js.map