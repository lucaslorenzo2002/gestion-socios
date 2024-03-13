import { ValidationError } from 'express-validator';
import {CustomError} from './custom-error.js'

export class RequestValidationError extends CustomError{
    statusCode = 400;
    
    constructor(public errors: ValidationError[]){
        super('Error en el input')

        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }

    serielizeErrors(){
        return this.errors.map(err => {
            return {message: err.msg}
        })
    }
}