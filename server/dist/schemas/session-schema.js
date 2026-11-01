export function createSession(accessTokenHash, accessTokenExpiresAt, refreshTokenHash, refreshTokenExpiresAt) {
    return {
        accessTokenHash,
        accessTokenExpiresAt,
        refreshTokenHash,
        refreshTokenExpiresAt,
        createdAt: new Date()
    };
}
export default createSession;
//# sourceMappingURL=session-schema.js.map