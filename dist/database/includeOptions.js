import { Actividad } from '../models/actividad.js';
import { CategoriaSocio } from '../models/categoriaSocio.js';
import { Club } from '../models/club.js';
import { Grupo_familiar } from '../models/grupo_familiar.js';
import { TipoSocio } from '../models/tipoSocio.js';
export class IncludeOptions {
    getUserIncludeOptions() {
        return [
            this.getTipoSocioIncludeOptions(),
            this.getClubAsociadoIncludeOptions(),
            this.getActividadIncludeOptions(),
            this.getCategoriaIncludeOptions(),
            this.getGrupoFamiliarIncludeOptions()
        ];
    }
    getAdminIncludeOptions() {
        return [
            this.getClubAsociadoIncludeOptions()
        ];
    }
    getTipoSocioIncludeOptions() {
        return {
            model: TipoSocio,
            attributes: ['tipo_socio'],
            as: 'tipo_socio'
        };
    }
    getGrupoFamiliarIncludeOptions() {
        return {
            model: Grupo_familiar,
            attributes: ['id', 'familiar_titular_id', 'descuento_id', 'cantidad_de_familiares']
        };
    }
    getClubAsociadoIncludeOptions() {
        return {
            model: Club,
            as: 'club_asociado'
        };
    }
    getCategoriaIncludeOptions() {
        return {
            model: CategoriaSocio,
            as: 'cat'
        };
    }
    getActividadIncludeOptions() {
        return {
            model: Actividad,
            as: 'activ'
        };
    }
}
//# sourceMappingURL=includeOptions.js.map