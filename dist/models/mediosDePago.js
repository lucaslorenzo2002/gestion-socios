import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';
export const MedioDePago = sequelize.define('MedioDePago', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    medio_de_pago: {
        type: DataTypes.TEXT,
    }
}, {
    underscored: true,
    timestamps: false
});
//# sourceMappingURL=mediosDePago.js.map