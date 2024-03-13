import { CustomError } from "./custom-error.js";

export class BadRequestError extends CustomError{
    statusCode = 500;

    constructor(public message: string){
        super(message)

        Object.setPrototypeOf(this, BadRequestError.prototype)
    }
    
    serielizeErrors(){ 
        return [{message: this.message}]
    }
}