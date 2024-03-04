import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';
import { Actividad } from './actividad.js';
import { Club } from './club.js';
export const CategoriaSocio = sequelize.define('CategoriaSocio', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    categoria: {
        type: DataTypes.STRING,
        allowNull: false
    },
    limite_de_jugadores: {
        type: DataTypes.INTEGER
    },
    cantidad_de_jugadores: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    underscored: true
});
Actividad.hasMany(CategoriaSocio, { foreignKey: 'actividad_id', sourceKey: 'id' });
CategoriaSocio.belongsTo(Actividad, { foreignKey: 'actividad_id', as: 'actividad' });
Club.hasMany(CategoriaSocio, { foreignKey: 'club_asociado_id', sourceKey: 'id' });
CategoriaSocio.belongsTo(Club, { foreignKey: 'club_asociado_id' });
//# sourceMappingURL=categoriaSocio.js.map