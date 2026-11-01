import jwt from "jsonwebtoken";
import crypto from "node:crypto";
export function generateAccessToken(user, role = "user") {
    const id = user._id ? user._id.toString() : user.id;
    return jwt.sign({ sub: id, role, type: "access" }, process.env.JWT_ACCESS_SECRET || "default_access_secret", { expiresIn: "15m" });
}
export function generateRefreshToken(user, role = "user") {
    const id = user._id ? user._id.toString() : user.id;
    return jwt.sign({ sub: id, role, type: "refresh" }, process.env.JWT_REFRESH_SECRET || "default_refresh_secret", { expiresIn: "7d" });
}
export function generateTokens(user, role = "user") {
    return {
        accessToken: generateAccessToken(user, role),
        refreshToken: generateRefreshToken(user, role)
    };
}
export function generateResetToken() {
    return crypto.randomBytes(32).toString("hex");
}
export function hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}
//# sourceMappingURL=token-utils.js.map