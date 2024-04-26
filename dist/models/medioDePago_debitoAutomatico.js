import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelizeConfig.js';
import { MedioDePago } from './mediosDePago.js';
import { DebitoAutomatico } from './debitoAutomatico.js';
export const MedioDePago_DebitoAutomatico = sequelize.define('MedioDePago_DebitoAutomatico', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
}, {
    underscored: true,
    timestamps: false
});
MedioDePago.belongsToMany(DebitoAutomatico, { through: MedioDePago_DebitoAutomatico, foreignKey: 'medio_de_pago_id' });
DebitoAutomatico.belongsToMany(MedioDePago, { through: MedioDePago_DebitoAutomatico, foreignKey: 'debito_automatico_id' });
MedioDePago_DebitoAutomatico.belongsTo(MedioDePago);
MedioDePago_DebitoAutomatico.belongsTo(DebitoAutomatico);
//# sourceMappingURL=medioDePago_debitoAutomatico.js.map