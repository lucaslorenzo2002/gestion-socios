import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';
import { Club } from './club.js';
import { Socio } from './socio.js';
export const Transaccion = sequelize.define('Transaccion', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    motivo: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    detalles: {
        type: DataTypes.TEXT,
    },
    estado: {
        type: DataTypes.TEXT,
        defaultValue: 'PENDIENTE',
        allowNull: false
    }
}, {
    underscored: true,
    timestamps: false
});
Club.hasMany(Transaccion, { foreignKey: 'club_asociado_id', sourceKey: 'id' });
Transaccion.belongsTo(Club, { foreignKey: 'club_asociado_id' });
Socio.hasMany(Transaccion, { foreignKey: 'socio_id', sourceKey: 'id' });
Transaccion.belongsTo(Socio, { foreignKey: 'socio_id' });
//# sourceMappingURL=transaccion.js.map