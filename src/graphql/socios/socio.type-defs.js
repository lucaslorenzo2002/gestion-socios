const socioType = `#graphql
    type Socio{
	    id: ID!,
	    apellido: String,
	    nombres: String,
	    email: String,
	    fec_nacimiento: String,
	    edad: Int,
	    foto_de_perfil: String,
	    tipo_de_grupo: String,
	    tipo_socio: String,
	    estado_socio: String,
	    tipo_doc: String,
	    nro_documento: String,
	    sexo: String,
	    es_jugador: Boolean,
	    telefono_fijo: String,
	    telefono_celular: String,
	    deuda: Int,
	    validado: Boolean,
	    perfil_completado: Int
}

  type Query {
    getSocioById(id: ID!): Socio
    getSocioByIdAdmin(id: ID!): Socio
    getAllSocios: [Socio]
  }

`;

module.exports = socioType;
