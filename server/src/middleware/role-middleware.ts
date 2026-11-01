import type { Request, Response, NextFunction } from "express";

export function requireRole(...allowedRoles: string[]) {
    return function (req: Request, res: Response, next: NextFunction) {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: insufficient permissions" });
        }
        next();
    };
}

export default requireRole;
