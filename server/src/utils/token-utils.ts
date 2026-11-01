import jwt from "jsonwebtoken";
import crypto from "node:crypto";

export function generateAccessToken(user: { _id?: any; id?: any }, role: "user" | "vendor" = "user"): string {
    const id = user._id ? user._id.toString() : user.id;
    return jwt.sign(
        { sub: id, role, type: "access" },
        process.env.JWT_ACCESS_SECRET || "default_access_secret",
        { expiresIn: "15m" }
    );
}

export function generateRefreshToken(user: { _id?: any; id?: any }, role: "user" | "vendor" = "user"): string {
    const id = user._id ? user._id.toString() : user.id;
    return jwt.sign(
        { sub: id, role, type: "refresh" },
        process.env.JWT_REFRESH_SECRET || "default_refresh_secret",
        { expiresIn: "7d" }
    );
}

export function generateTokens(user: { _id?: any; id?: any }, role: "user" | "vendor" = "user") {
    return {
        accessToken: generateAccessToken(user, role),
        refreshToken: generateRefreshToken(user, role)
    };
}

export function generateResetToken(): string {
    return crypto.randomBytes(32).toString("hex");
}

export function hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
}
