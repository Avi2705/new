import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiHandler from "../utils/error-handler.js";
import { generateTokens, generateResetToken, hashToken } from "../utils/token-utils.js";
import { findUserByEmail, findVendorById, registerUser, updateUnverifiedVendor, savePasswordResetToken, findUserByResetToken, resetUserPassword, addSession, removeSession, updateVendor, verifyVendorOtp } from "../dal/vendor-dal.js";
import { sendPasswordResetEmail, sendVerificationOtp } from "../utils/email-service.js";
import { ObjectId } from "mongodb";
import generateOTP from "../utils/otp-utils.js";
import { getDatabase } from "../config/db.js";
async function registerVendorService(vendorData) {
    const normalizedEmail = vendorData.email.trim().toLowerCase();
    const existingVendor = await findUserByEmail(normalizedEmail);
    if (existingVendor) {
        if (existingVendor.isVerified) {
            throw new ApiHandler(400, "Vendor already exists");
        }
        const hashedPassword = await bcrypt.hash(vendorData.password, 12);
        const otpCode = generateOTP();
        const otpHash = await bcrypt.hash(otpCode, 10);
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        try {
            await sendVerificationOtp(normalizedEmail, otpCode);
        }
        catch {
            throw new ApiHandler(500, "Failed to send OTP. Please try again.");
        }
        await updateUnverifiedVendor(existingVendor._id, {
            name: vendorData.name.trim(),
            password: hashedPassword,
            otpHash,
            otpExpiresAt
        });
        return { message: "Account already registered but not verified. A new OTP has been sent to your email." };
    }
    const hashedPassword = await bcrypt.hash(vendorData.password, 12);
    const otpCode = generateOTP();
    const otpHash = await bcrypt.hash(otpCode, 10);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const newVendor = {
        name: vendorData.name.trim(),
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
    }
    catch {
        throw new ApiHandler(500, "Failed to send OTP. Please try again.");
    }
    await registerUser(newVendor);
    return { message: "OTP sent to your email. Please verify to activate your account." };
}
async function verifyVendorOtpService(email, otpInput) {
    const normalizedEmail = email.trim().toLowerCase();
    const vendor = await findUserByEmail(normalizedEmail);
    if (!vendor)
        throw new ApiHandler(404, "Vendor not found");
    if (vendor.isVerified)
        throw new ApiHandler(400, "Account is already verified");
    if (!vendor.otpHash || !vendor.otpExpiresAt)
        throw new ApiHandler(400, "No OTP found. Please register again.");
    if (new Date() > new Date(vendor.otpExpiresAt))
        throw new ApiHandler(400, "OTP has expired. Please register again.");
    const isOtpValid = await bcrypt.compare(String(otpInput), vendor.otpHash);
    if (!isOtpValid)
        throw new ApiHandler(400, "Invalid OTP");
    await verifyVendorOtp(vendor._id);
    return { message: "Email verified successfully. You can now login." };
}
async function loginVendorService(vendorData) {
    const normalizedEmail = vendorData.email.trim().toLowerCase();
    const vendor = await findUserByEmail(normalizedEmail);
    if (!vendor || !vendor.password)
        throw new ApiHandler(401, "Invalid email or password");
    if (!vendor.isVerified) {
        throw new ApiHandler(403, "Account not verified. Please verify your email with the OTP sent during registration.");
    }
    const isPasswordValid = await bcrypt.compare(vendorData.password, vendor.password);
    if (!isPasswordValid)
        throw new ApiHandler(401, "Invalid email or password");
    const tokens = generateTokens(vendor, "vendor");
    const accessTokenHash = hashToken(tokens.accessToken);
    const refreshTokenHash = hashToken(tokens.refreshToken);
    const accessTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await addSession(vendor._id, accessTokenHash, accessTokenExpiresAt, refreshTokenHash, refreshTokenExpiresAt);
    return {
        vendor: { id: vendor._id, name: vendor.name, email: vendor.email },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
    };
}
async function forgotPasswordVendorService(email) {
    const normalizedEmail = email.trim().toLowerCase();
    const vendor = await findUserByEmail(normalizedEmail);
    if (!vendor)
        return;
    if (!vendor.isVerified) {
        throw new ApiHandler(403, "Account not verified. Please verify your email first.");
    }
    const resetToken = generateResetToken();
    const resetPasswordTokenHash = hashToken(resetToken);
    const resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await savePasswordResetToken(vendor._id, resetPasswordTokenHash, resetPasswordExpiresAt);
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/vendor/reset-password?token=${encodeURIComponent(resetToken)}`;
    try {
        await sendPasswordResetEmail(vendor.email, resetUrl);
    }
    catch (err) {
        await getDatabase().collection("vendor").updateOne({ _id: vendor._id }, { $unset: { resetPasswordTokenHash: "", resetPasswordExpiresAt: "" } });
        throw err;
    }
}
async function resetPasswordVendorService(token, newPassword) {
    const resetPasswordTokenHash = hashToken(token);
    const vendor = await findUserByResetToken(resetPasswordTokenHash);
    if (!vendor)
        throw new ApiHandler(400, "Invalid or expired reset token");
    if (!vendor.isVerified) {
        throw new ApiHandler(403, "Account not verified. Please verify your email first.");
    }
    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    const result = await resetUserPassword(vendor._id, resetPasswordTokenHash, newPasswordHash);
    if (result.modifiedCount !== 1)
        throw new ApiHandler(400, "Invalid or expired reset token");
    return true;
}
async function logoutVendorService(refreshToken, accessToken) {
    let vendorId = null;
    let tokenHash = null;
    if (refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "default_refresh_secret");
            vendorId = decoded.sub;
        }
        catch {
            const decoded = jwt.decode(refreshToken);
            if (decoded?.sub)
                vendorId = decoded.sub;
        }
        tokenHash = hashToken(refreshToken);
    }
    else if (accessToken) {
        const decoded = jwt.decode(accessToken);
        if (decoded?.sub)
            vendorId = decoded.sub;
        tokenHash = hashToken(accessToken);
    }
    if (!vendorId || !tokenHash)
        throw new ApiHandler(400, "No valid token provided");
    const _id = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    await removeSession(_id, tokenHash);
}
async function getVendorProfileService(vendorId) {
    if (!vendorId)
        throw new ApiHandler(400, "Vendor ID is required");
    const vendor = await findVendorById(vendorId);
    if (!vendor)
        throw new ApiHandler(404, "Vendor not found");
    return vendor;
}
async function updateVendorProfileService(vendorId, name) {
    if (!vendorId || !name)
        throw new ApiHandler(400, "Name is required");
    const vendor = await findVendorById(vendorId);
    if (!vendor)
        throw new ApiHandler(404, "Vendor not found");
    await updateVendor(vendorId, name.trim());
    return { ...vendor, name: name.trim() };
}
export { registerVendorService, verifyVendorOtpService, loginVendorService, forgotPasswordVendorService, resetPasswordVendorService, logoutVendorService, getVendorProfileService, updateVendorProfileService };
//# sourceMappingURL=vendor-service.js.map