export function calcularDescuentoPorCuota(cantidadPersonasGrupo: number, totalDescuento: number, valorCuota: number) {
    const porcentajeDescuentoPorCuota = (totalDescuento / (cantidadPersonasGrupo * valorCuota)) * 100;
    const descuentoPorCuota = valorCuota * (porcentajeDescuentoPorCuota / 100);

    return descuentoPorCuota;
}