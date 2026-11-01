import ApiHandler from "../utils/error-handler.js";
export const errorHandler = (err, _req, res, _next) => {
    if (err instanceof ApiHandler) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    const statusCode = err?.statusCode || err?.status || 500;
    const message = err?.message || "Internal server error";
    return res.status(statusCode).json({ message });
};
export default errorHandler;
//# sourceMappingURL=error-middlware.js.map