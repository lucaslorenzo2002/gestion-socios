import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';
import { Club } from './club.js';
import { Descuento_grupo_familiar } from './descuento_grupo_familiar.js';
export const Grupo_familiar = sequelize.define('Grupo_familiar', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    apellido_titular: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    cantidad_de_familiares: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    familiar_titular_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    underscored: true
});
Club.hasMany(Grupo_familiar, { foreignKey: 'club_asociado_id', sourceKey: 'id' });
Grupo_familiar.belongsTo(Club, { foreignKey: 'club_asociado_id' });
Descuento_grupo_familiar.hasMany(Grupo_familiar, { foreignKey: 'descuento_id', sourceKey: 'id' });
Grupo_familiar.belongsTo(Descuento_grupo_familiar, { foreignKey: 'descuento_id' });
//# sourceMappingURL=grupo_familiar.js.map