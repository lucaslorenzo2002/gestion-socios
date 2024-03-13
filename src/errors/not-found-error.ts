import { CustomError } from "./custom-error.js";

 
export class NotFoundError extends CustomError{
    statusCode = 404;

    constructor(){
        super('Ruta no encontrada')

        Object.setPrototypeOf(this, NotFoundError.prototype)
    }

    serielizeErrors(){
        return [{message: 'No encontrado'}]
    }
} 