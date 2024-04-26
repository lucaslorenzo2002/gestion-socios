export interface IInscripcionAttrs {
    id?: number;
    frecuencia_de_abono: string;
    monto: number;
    tipo_de_cuota: string;
    club_asociado_id: number;
    tipo_socio_id?: number;
    actividad_id?: number;
    categoria_id?: number;
}