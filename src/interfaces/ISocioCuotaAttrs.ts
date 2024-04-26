export interface ISocioCuotaAttrs{
    monto: number;
    socio_id: number;
    cuota_id: number;
    inscripcion_id?: number;
    periodo: string;
    forma_de_pago?: string;
    fecha_pago?: Date;
    estado?: string;
}