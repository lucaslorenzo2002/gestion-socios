import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';
import { Socio } from './socio.js';
import { CategoriaSocio } from './categoriaSocio.js';
import { Club } from './club.js';
import { Actividad } from './actividad.js';
export const CategoriaSocio_Socio = sequelize.define('CategoriaSocio_Socio', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
}, {
    underscored: true,
    timestamps: false
});
Socio.belongsToMany(CategoriaSocio, { through: CategoriaSocio_Socio, foreignKey: 'socio_id' });
CategoriaSocio.belongsToMany(Socio, { through: CategoriaSocio_Socio, foreignKey: 'categoria_socio_id' });
CategoriaSocio_Socio.belongsTo(Socio);
CategoriaSocio_Socio.belongsTo(CategoriaSocio);
Club.hasMany(CategoriaSocio_Socio, { foreignKey: 'club_asociado_id', sourceKey: 'id' });
CategoriaSocio_Socio.belongsTo(Club, { foreignKey: 'club_asociado_id' });
Actividad.hasMany(CategoriaSocio_Socio, { foreignKey: 'actividad_id', sourceKey: 'id' });
CategoriaSocio_Socio.belongsTo(Actividad, { foreignKey: 'actividad_id' });
//# sourceMappingURL=categoriaSocio_socio.js.map