import type { Request, Response, NextFunction } from "express";
export declare function requireRole(...allowedRoles: string[]): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default requireRole;
//# sourceMappingURL=role-middleware.d.ts.map