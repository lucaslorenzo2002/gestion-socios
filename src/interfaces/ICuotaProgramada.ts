export interface ICuotaProgramada{
    monto: number;
    abono_multiple: boolean
    maxima_cantidad_abono_multiple: number;
    tipo_de_cuota: string;
    dia_de_vencimiento: number;
    actualiza_monto_cuando_vence: boolean;
    monto_post_vencimiento: number;
    interes_cuota_post_vencimiento: number;
    frecuencia_interes: string;
    actividad_id?:number;
    categoria_id?:number;
    tipo_socio_id?:number;
}