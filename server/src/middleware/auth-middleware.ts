import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import type { Request, Response, NextFunction } from "express";
import { generateAccessToken, hashToken } from "../utils/token-utils.js";
import { getDatabase } from "../config/db.js";

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const accessToken = typeof authHeader === "string" && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    const rawRefreshToken = req.headers["x-refresh-token"] || req.headers["refresh-token"];
    const refreshToken = typeof rawRefreshToken === "string" ? rawRefreshToken : null;

    if (refreshToken) {
        (req as any).refreshToken = refreshToken;
    }

    if (accessToken) {
        try {
            const decoded: any = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET || "default_access_secret");
            if (decoded.type === "access") {
                if (decoded.isVerified === false) {
                    return res.status(403).json({ message: "Account not verified. Please verify your email with the OTP sent during registration." });
                }
                req.user = { ...decoded, id: decoded.sub };
                return next();
            }
        } catch {
        }
    }

    if (!refreshToken) {
        return res.status(401).json({
            message: "Access token is expired or invalid, and refresh token was not provided."
        });
    }

    let decodedRefresh: any;
    try {
        decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "default_refresh_secret");
        if (decodedRefresh.type !== "refresh" || !decodedRefresh.sub) {
            return res.status(401).json({ message: "Invalid refresh token." });
        }
    } catch {
        return res.status(401).json({
            message: "Refresh token is expired or invalid. Please login again."
        });
    }

    try {
        if (!decodedRefresh.sub || !ObjectId.isValid(decodedRefresh.sub) || !/^[0-9a-fA-F]{24}$/.test(String(decodedRefresh.sub))) {
            return res.status(401).json({ message: "Invalid refresh token." });
        }

        const database = getDatabase();
        const currentRefreshTokenHash = hashToken(refreshToken);
        const userId = new ObjectId(String(decodedRefresh.sub));

        let isVendor = decodedRefresh.role === "vendor";
        let collectionName = isVendor ? "vendor" : "users";

        let user: any = await database.collection(collectionName).findOne({
            _id: userId,
            sessions: {
                $elemMatch: {
                    $or: [
                        { refreshTokenHash: currentRefreshTokenHash, refreshTokenExpiresAt: { $gt: new Date() } },
                        { tokenHash: currentRefreshTokenHash, expiresAt: { $gt: new Date() } }
                    ]
                }
            }
        });

        if (!user) {
            const alternateCollection = collectionName === "vendor" ? "users" : "vendor";
            user = await database.collection(alternateCollection).findOne({
                _id: userId,
                sessions: {
                    $elemMatch: {
                        $or: [
                            { refreshTokenHash: currentRefreshTokenHash, refreshTokenExpiresAt: { $gt: new Date() } },
                            { tokenHash: currentRefreshTokenHash, expiresAt: { $gt: new Date() } }
                        ]
                    }
                }
            });
            if (user) {
                collectionName = alternateCollection;
                isVendor = collectionName === "vendor";
            }
        }

        if (!user) {
            return res.status(401).json({
                message: "Session expired or revoked. Please login again."
            });
        }

        if (user.isVerified === false) {
            return res.status(403).json({ message: "Account not verified. Please verify your email first." });
        }

        const role = decodedRefresh.role || (isVendor ? "vendor" : "user");
        const newAccessToken = generateAccessToken(user, role);
        const newAccessTokenHash = hashToken(newAccessToken);
        const newAccessTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await database.collection(collectionName).updateOne(
            {
                _id: user._id,
                "sessions.refreshTokenHash": currentRefreshTokenHash
            },
            {
                $set: {
                    "sessions.$[elem].accessTokenHash": newAccessTokenHash,
                    "sessions.$[elem].accessTokenExpiresAt": newAccessTokenExpiresAt,
                    "sessions.$[elem].updatedAt": new Date(),
                    updatedAt: new Date()
                }
            },
            {
                arrayFilters: [{ "elem.refreshTokenHash": currentRefreshTokenHash }]
            }
        );

        res.set("Authorization", `Bearer ${newAccessToken}`);
        res.set("x-refresh-token", refreshToken);
        res.set("Access-Control-Expose-Headers", "Authorization, x-refresh-token");

        req.user = {
            id: user._id.toString(),
            email: user.email,
            role: role
        };
        (req as any).refreshToken = refreshToken;

        return next();
    } catch (err) {
        return next(err);
    }
}
