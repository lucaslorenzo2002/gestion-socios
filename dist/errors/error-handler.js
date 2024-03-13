import { RequestValidationError } from "./request-validation-error.js";
export const errorHandler = (err, req, res, next) => {
    if (err instanceof RequestValidationError) {
        res.status(500).json({ message: err.errors[0].msg });
    }
    else {
        res.status(500).json({ message: err.message });
    }
};
//# sourceMappingURL=error-handler.js.map