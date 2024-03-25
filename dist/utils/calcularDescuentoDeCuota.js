export function calcularDescuentoPorCuota(cantidadPersonasGrupo, totalDescuento, valorCuota) {
    const porcentajeDescuentoPorCuota = (totalDescuento / (cantidadPersonasGrupo * valorCuota)) * 100;
    const descuentoPorCuota = valorCuota * (porcentajeDescuentoPorCuota / 100);
    return descuentoPorCuota;
}
//# sourceMappingURL=calcularDescuentoDeCuota.js.map