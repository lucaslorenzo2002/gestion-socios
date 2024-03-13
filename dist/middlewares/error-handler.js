import { CustomError } from "../errors/custom-error.js";
export const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ errors: err.serielizeErrors() });
    }
    return res.status(500).json({ message: err.message });
};
//# sourceMappingURL=error-handler.js.map