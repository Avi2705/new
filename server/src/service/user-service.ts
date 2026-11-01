import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiHandler from "../utils/error-handler.js";
import { generateTokens, generateResetToken, hashToken } from "../utils/token-utils.js";
import {
    findUserByEmail,
    findUserById,
    registerUser,
    updateUnverifiedUser,
    savePasswordResetToken,
    findUserByResetToken,
    resetUserPassword,
    addSession,
    removeSession,
    updateUser,
    verifyUserOtp,
    findUsersByIds
} from "../dal/user-dal.js";
import { sendPasswordResetEmail, sendVerificationOtp } from "../utils/email-service.js";
import { ObjectId } from "mongodb";
import generateOTP from "../utils/otp-utils.js";
import { getDatabase } from "../config/db.js";
import type { UserRegistrationInput, UserLoginInput, UserDoc } from "../model/user.model.js";

async function registerUserService(userData: UserRegistrationInput) {
    const normalizedEmail = userData.email.trim().toLowerCase();
    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
        if (existingUser.isVerified) {
            throw new ApiHandler(400, "User already exists");
        }

        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const otpCode = generateOTP();
        const otpHash = await bcrypt.hash(otpCode, 10);
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        try {
            await sendVerificationOtp(normalizedEmail, otpCode);
        } catch {
            throw new ApiHandler(500, "Failed to send OTP. Please try again.");
        }

        await updateUnverifiedUser(existingUser._id, {
            name: userData.name.trim(),
            password: hashedPassword,
            otpHash,
            otpExpiresAt
        });

        return { message: "Account already registered but not verified. A new OTP has been sent to your email." };
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const otpCode = generateOTP();
    const otpHash = await bcrypt.hash(otpCode, 10);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const newUser: UserDoc = {
        name: userData.name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        otpHash,
        otpExpiresAt,
        isVerified: false,
        sessions: [],
        resetPasswordTokenHash: null,
        resetPasswordExpiresAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    try {
        await sendVerificationOtp(normalizedEmail, otpCode);
    } catch {
        throw new ApiHandler(500, "Failed to send OTP. Please try again.");
    }

    await registerUser(newUser);
    return { message: "OTP sent to your email. Please verify to activate your account." };
}

async function verifyOtpService(email: string, otpInput: string | number) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await findUserByEmail(normalizedEmail);

    if (!user) throw new ApiHandler(404, "User not found");
    if (user.isVerified) throw new ApiHandler(400, "Account is already verified");
    if (!user.otpHash || !user.otpExpiresAt) throw new ApiHandler(400, "No OTP found. Please register again.");
    if (new Date() > new Date(user.otpExpiresAt)) throw new ApiHandler(400, "OTP has expired. Please register again.");

    const isOtpValid = await bcrypt.compare(String(otpInput), user.otpHash);
    if (!isOtpValid) throw new ApiHandler(400, "Invalid OTP");

    await verifyUserOtp(user._id);
    return { message: "Email verified successfully. You can now login." };
}

async function loginUserService(userData: UserLoginInput) {
    const normalizedEmail = userData.email.trim().toLowerCase();
    const user = await findUserByEmail(normalizedEmail);
    if (!user || !user.password) throw new ApiHandler(401, "Invalid email or password");

    if (!user.isVerified) {
        throw new ApiHandler(403, "Account not verified. Please verify your email with the OTP sent during registration.");
    }

    const isPasswordValid = await bcrypt.compare(userData.password, user.password);
    if (!isPasswordValid) throw new ApiHandler(401, "Invalid email or password");

    const tokens = generateTokens(user, "user");
    const accessTokenHash = hashToken(tokens.accessToken);
    const refreshTokenHash = hashToken(tokens.refreshToken);
    const accessTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await addSession(user._id, accessTokenHash, accessTokenExpiresAt, refreshTokenHash, refreshTokenExpiresAt);
    return {
        user: { id: user._id, name: user.name, email: user.email },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
    };
}

async function forgotPasswordService(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await findUserByEmail(normalizedEmail);
    if (!user) return;

    if (!user.isVerified) {
        throw new ApiHandler(403, "Account not verified. Please verify your email first.");
    }

    const resetToken = generateResetToken();
    const resetPasswordTokenHash = hashToken(resetToken);
    const resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await savePasswordResetToken(user._id, resetPasswordTokenHash, resetPasswordExpiresAt);
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${encodeURIComponent(resetToken)}`;
    try {
        await sendPasswordResetEmail(user.email, resetUrl);
    } catch (err) {
        await getDatabase().collection("users").updateOne(
            { _id: user._id },
            { $unset: { resetPasswordTokenHash: "", resetPasswordExpiresAt: "" } }
        );
        throw err;
    }
}

async function resetPasswordService(token: string, newPassword: string) {
    const resetPasswordTokenHash = hashToken(token);
    const user = await findUserByResetToken(resetPasswordTokenHash);
    if (!user) throw new ApiHandler(400, "Invalid or expired reset token");

    if (!user.isVerified) {
        throw new ApiHandler(403, "Account not verified. Please verify your email first.");
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    const result = await resetUserPassword(user._id, resetPasswordTokenHash, newPasswordHash);
    if (result.modifiedCount !== 1) throw new ApiHandler(400, "Invalid or expired reset token");
    return true;
}

async function logoutUserService(refreshToken?: string | null, accessToken?: string | null) {
    let userId: string | null = null;
    let tokenHash: string | null = null;

    if (refreshToken) {
        try {
            const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "default_refresh_secret");
            userId = decoded.sub;
        } catch {
            const decoded: any = jwt.decode(refreshToken);
            if (decoded?.sub) userId = decoded.sub;
        }
        tokenHash = hashToken(refreshToken);
    } else if (accessToken) {
        const decoded: any = jwt.decode(accessToken);
        if (decoded?.sub) userId = decoded.sub;
        tokenHash = hashToken(accessToken);
    }

    if (!userId || !tokenHash) throw new ApiHandler(400, "No valid token provided");

    const _id = typeof userId === "string" ? new ObjectId(userId) : userId;
    await removeSession(_id, tokenHash);
}

async function getUserProfileService(userId: string | ObjectId) {
    if (!userId) throw new ApiHandler(400, "User ID is required");
    const user = await findUserById(userId);
    if (!user) throw new ApiHandler(404, "User not found");
    return user;
}

async function updateProfileService(userId: string | ObjectId, name: string) {
    if (!userId || !name) throw new ApiHandler(400, "Name is required");
    const user = await findUserById(userId);
    if (!user) throw new ApiHandler(404, "User not found");
    await updateUser(userId, name.trim());
    return { ...user, name: name.trim() };
}

async function getUsersByIds(userIds: (string | ObjectId)[]) {
    if (!userIds || !Array.isArray(userIds)) {
        throw new ApiHandler(400, "userIds are not valid");
    }
    const users = await findUsersByIds(userIds);
    return users;
}

export {
    getUsersByIds,
    registerUserService,
    verifyOtpService,
    loginUserService,
    forgotPasswordService,
    resetPasswordService,
    logoutUserService,
    getUserProfileService,
    updateProfileService
};
