import bcrypt from 'bcrypt';
export const hash = (string) => {
    return bcrypt.hashSync(string, bcrypt.genSaltSync(10));
};
//# sourceMappingURL=hashing.js.map