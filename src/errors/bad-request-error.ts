import { CustomError } from "./custom-error.js";

export class BadRequestError extends CustomError{
    statusCode = 500;

    constructor(public message: string){
        super(message)

        Object.setPrototypeOf(this, BadRequestError.prototype)
    }
    
    serielizeErrors(){ 
        console.error(this.message)
        return [{message: this.message}]
    }
}