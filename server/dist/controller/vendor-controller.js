import { registerVendorService, verifyVendorOtpService, loginVendorService, forgotPasswordVendorService, resetPasswordVendorService, logoutVendorService, getVendorProfileService, updateVendorProfileService } from "../service/vendor-service.js";
async function vendorRegister(req, res) {
    try {
        const result = await registerVendorService(req.body);
        return res.status(201).json(result);
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
async function verifyVendorOtp(req, res) {
    try {
        const { email, otp } = req.body;
        const result = await verifyVendorOtpService(email, otp);
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
async function vendorLogin(req, res) {
    try {
        const result = await loginVendorService(req.body);
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
async function forgotVendorPassword(req, res) {
    try {
        await forgotPasswordVendorService(req.body.email);
        return res.status(200).json({ message: "If that email is registered, a password reset link has been sent." });
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
async function resetVendorPassword(req, res) {
    try {
        const { token, newPassword } = req.body;
        await resetPasswordVendorService(token, newPassword);
        return res.status(200).json({ message: "Password reset successful. Please login with your new password." });
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
async function vendorLogout(req, res) {
    try {
        const refreshToken = req.refreshToken || req.cookies?.refreshToken;
        const authHeader = req.headers["authorization"];
        const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
        await logoutVendorService(refreshToken, accessToken);
        res.clearCookie("refreshToken");
        return res.status(200).json({ message: "Logged out successfully" });
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
async function getVendorProfile(req, res) {
    try {
        const vendor = await getVendorProfileService(req.user.id);
        return res.status(200).json({ vendor });
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
async function vendorUpdate(req, res) {
    try {
        const { name } = req.body;
        const vendor = await updateVendorProfileService(req.user.id, name);
        return res.status(200).json({ message: "Profile updated successfully", vendor });
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
export { vendorRegister, verifyVendorOtp, vendorLogin, forgotVendorPassword, resetVendorPassword, vendorLogout, getVendorProfile, vendorUpdate };
//# sourceMappingURL=vendor-controller.js.map