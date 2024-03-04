import bcrypt from 'bcrypt';

export const hash = (string: string) => {
	return bcrypt.hashSync(string, bcrypt.genSaltSync(10));
};
