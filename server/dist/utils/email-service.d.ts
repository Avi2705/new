import "dotenv/config";
declare function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void>;
declare function sendVerificationOtp(email: string, otp: string | number): Promise<void>;
export { sendPasswordResetEmail, sendVerificationOtp };
//# sourceMappingURL=email-service.d.ts.map