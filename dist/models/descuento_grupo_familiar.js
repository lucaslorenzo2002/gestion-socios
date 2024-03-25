import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';
import { Club } from './club.js';
export const Descuento_grupo_familiar = sequelize.define('Descuento_grupo_familiar', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    descuento_cuota: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    cantidad_de_familiares: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    underscored: true
});
Club.hasMany(Descuento_grupo_familiar, { foreignKey: 'club_asociado_id', sourceKey: 'id' });
Descuento_grupo_familiar.belongsTo(Club, { foreignKey: 'club_asociado_id' });
//# sourceMappingURL=descuento_grupo_familiar.js.map