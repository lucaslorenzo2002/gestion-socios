import { body } from 'express-validator';
export const registerRequestValidation = [
    body("nroDocumento")
        .isNumeric()
        .isLength({ max: 8 }).withMessage('ingrese un numero de documento valido'),
    body('email')
        .isEmail().withMessage('El mail ingresado no es valido'),
    body('password')
        .isString()
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    /* body("confirmPassword")
        .isString()
        .equals('password').withMessage("las contraseñas no coinciden") */
];
export const resetPasswordRequestValidation = [
    body('newPassword')
        .isString()
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    body("confirmNewPassword")
        .isString()
        .equals('newPassword')
        .withMessage("las contraseñas no coinciden"),
];
export const resetPasswordReqRequestValidation = [
    body('email')
        .isEmail().withMessage('El mail ingresado no es valido'),
];
//# sourceMappingURL=auth.js.map