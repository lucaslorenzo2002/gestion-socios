export interface ICuota{
    id: number;
    monto: number;
    tipo_de_cuota: string;
    fecha_emision: Date;
    fecha_vencimiento: Date;
    cuota_programada_id: number;
    club_asociado_id: number;
    tipo_socio_id: number;
    actividad_id: number;
    categoria_id: number;
}