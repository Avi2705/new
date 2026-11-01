import type { Request, Response, NextFunction } from "express";
import type { Schema } from "joi";

export function validateRequest(schema: Schema) {
    return function (req: Request, res: Response, next: NextFunction) {
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
