const cuotasType = `#graphql
    type Cuota{
	    id: ID!,
	    monto: Int,
	    fecha_emision: String,
	    fecha_pago: String,
	    fecha_vencimiento: String,
	    forma_de_pago: String,
	    banco: String,
	    to: String,
	    estado_socio: String,
	    nro_recibo: String,
	    club: String,
	    estado: String
    }

    type Query {
        getMisCuotas(id: ID!): [Cuota]
        getCuota(id: ID!): [Cuota]
        getAllCuotas(club: String): [Cuota]
  }

`;

module.exports = cuotasType;
