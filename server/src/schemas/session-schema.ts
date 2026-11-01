import type { SessionInfo } from "../model/user.model.js";

export function createSession(
    accessTokenHash: string,
    accessTokenExpiresAt: Date,
    refreshTokenHash: string,
    refreshTokenExpiresAt: Date
): SessionInfo {
    return {
        accessTokenHash,
        accessTokenExpiresAt,
        refreshTokenHash,
        refreshTokenExpiresAt,
        createdAt: new Date()
    };
}

export default createSession;
