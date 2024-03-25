import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';
export const Socio_Cuota = sequelize.define('Socio_Cuota', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    monto: {
        type: DataTypes.INTEGER
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
    },
    socio_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cuota_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    underscored: true,
    timestamps: false
});
//# sourceMappingURL=socio_cuota.js.map