import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';
import { Socio } from './socio.js';
import { Cuota } from './cuota.js';
import { Inscripcion } from './inscripcion.js';
export const Socio_Cuota = sequelize.define('Socio_Cuota', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    monto: {
        type: DataTypes.INTEGER
    },
    periodo: {
        type: DataTypes.STRING
    },
    forma_de_pago: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.STRING,
        defaultValue: 'PENDIENTE'
    },
    fecha_pago: {
        type: DataTypes.DATE
    }
}, {
    underscored: true,
    timestamps: true
});
Socio.hasMany(Socio_Cuota, { foreignKey: 'socio_id', sourceKey: 'id' });
Socio_Cuota.belongsTo(Socio, { foreignKey: 'socio_id' });
Cuota.hasMany(Socio_Cuota, { foreignKey: 'cuota_id', sourceKey: 'id' });
Socio_Cuota.belongsTo(Cuota, { foreignKey: 'cuota_id' });
Inscripcion.hasMany(Socio_Cuota, { foreignKey: 'inscripcion_id', sourceKey: 'id' });
Socio_Cuota.belongsTo(Inscripcion, { foreignKey: 'inscripcion_id' });
//# sourceMappingURL=socio_cuota.js.map