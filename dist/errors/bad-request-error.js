import { CustomError } from "./custom-error.js";
export class BadRequestError extends CustomError {
    constructor(message) {
        super(message);
        this.message = message;
        this.statusCode = 500;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    serielizeErrors() {
        return [{ message: this.message }];
    }
}
//# sourceMappingURL=bad-request-error.js.map