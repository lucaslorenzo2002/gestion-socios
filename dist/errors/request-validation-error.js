import { CustomError } from './custom-error.js';
export class RequestValidationError extends CustomError {
    constructor(errors) {
        super('Error en el input');
        this.errors = errors;
        this.statusCode = 400;
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    serielizeErrors() {
        return this.errors.map(err => {
            return { message: err.msg };
        });
    }
}
//# sourceMappingURL=request-validation-error.js.map