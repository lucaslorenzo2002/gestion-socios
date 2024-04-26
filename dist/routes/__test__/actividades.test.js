import { Actividad } from "../../models/actividad.js";
it('crea una actividad, crea una cuota de inscripcion para la actividad, crea un socio, agrega el socio a pendientes', async () => {
    const actividad = await Actividad.create({
        actividad: 'Futbol',
        posee_categorias: false,
        club_asociado_id: 1
    });
    const agent = await global.signin();
    await agent
        .post('/api/programarinscripcion')
        .send({
        frecuencia_de_abono: 'pago unico',
        monto: 2000,
        actividad_id: actividad.id,
        categoria_id: [],
        tipo_socio_id: null,
        tipo_de_cuota: 'abono inscripcion',
    })
        .expect(201);
    const responseNewSocio = await agent
        .post('/api/crearsocio')
        .send({
        nombres: 'Lucas',
        apellido: 'Lorenzo2',
        socioDesde: '10-01-2002',
        id: 43875235
    })
        .expect(200);
    await agent
        .post(`/api/asignarsociosaactividad/${actividad.id}`)
        .send({
        sociosId: [43875235]
    })
        .expect(201);
});
//# sourceMappingURL=actividades.test.js.map