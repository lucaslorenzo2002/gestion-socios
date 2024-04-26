it('returns a 200 on successful socio register', async () => {
    const agent = await global.signin();
    await agent
        .post('/api/crearsocio')
        .send({
        nombres: 'Lucas',
        apellido: 'Lorenzo',
        socioDesde: '10-01-2002',
        id: 43875234
    })
        .expect(200);
});
export {};
//# sourceMappingURL=socios.test.js.map