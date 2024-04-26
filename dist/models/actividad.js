import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';
import { Club } from './club.js';
export const Actividad = sequelize.define('Actividad', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    actividad: {
        type: DataTypes.STRING,
        allowNull: false
    },
    posee_categorias: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    limite_de_jugadores: {
        type: DataTypes.INTEGER
    },
    cantidad_de_jugadores: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    posee_cuota_inscripcion: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    underscored: true
});
Club.hasMany(Actividad, { foreignKey: 'club_asociado_id', sourceKey: 'id' });
Actividad.belongsTo(Club, { foreignKey: 'club_asociado_id' });
//# sourceMappingURL=actividad.js.map