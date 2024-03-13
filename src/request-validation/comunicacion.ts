import { body } from 'express-validator'

export const mailsIndividualizadosRequestValidation = [
    body('mails')
        .isArray({min: 1}).withMessage('Debe seleccionar por lo menos un socio'),
    ]       