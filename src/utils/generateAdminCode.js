function generateAdminCode() {
	let codigo = '';
	const caracteres = '0123456789';

	for (let i = 0; i < 10; i++) {
		const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
		codigo += caracteres.charAt(indiceAleatorio);
	}
    
	return codigo;
}
module.exports = generateAdminCode;