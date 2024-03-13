import { CustomError } from "./custom-error.js";
export class NotFoundError extends CustomError {
    constructor() {
        super('Ruta no encontrada');
        this.statusCode = 404;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serielizeErrors() {
        return [{ message: 'No encontrado' }];
    }
}
//# sourceMappingURL=not-found-error.js.map