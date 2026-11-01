import type { Request, Response, NextFunction } from "express";
import type { Schema } from "joi";
export declare function validateRequest(schema: Schema): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default validateRequest;
//# sourceMappingURL=validation-middleware.d.ts.map