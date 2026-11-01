import rateLimit from "express-rate-limit";

export const otpRateLimit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: { message: "Too many OTP attempts, please try again after 5 minutes" },
    standardHeaders: true,
    legacyHeaders: false
});

export default otpRateLimit;
