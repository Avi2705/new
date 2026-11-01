export declare function generateAccessToken(user: {
    _id?: any;
    id?: any;
}, role?: "user" | "vendor"): string;
export declare function generateRefreshToken(user: {
    _id?: any;
    id?: any;
}, role?: "user" | "vendor"): string;
export declare function generateTokens(user: {
    _id?: any;
    id?: any;
}, role?: "user" | "vendor"): {
    accessToken: string;
    refreshToken: string;
};
export declare function generateResetToken(): string;
export declare function hashToken(token: string): string;
//# sourceMappingURL=token-utils.d.ts.map