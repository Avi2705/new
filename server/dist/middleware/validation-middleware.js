export function validateRequest(schema) {
    return function (req, res, next) {
        const result = schema.validate(req.body);
        if (result.error && result.error.details && result.error.details[0]) {
            return res.status(400).json({
                message: result.error.details[0].message
            });
        }
        req.body = result.value;
        next();
    };
}
export default validateRequest;
//# sourceMappingURL=validation-middleware.js.map