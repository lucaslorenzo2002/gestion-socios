import { body } from 'express-validator';
export const crearSocioRequestValidation = [
    body("id")
        .isNumeric()
        .isLength({ max: 8 }).withMessage('ingrese un numero de documento valido')
];
//# sourceMappingURL=socios.js.map