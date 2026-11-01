import { registerUserService, verifyOtpService, loginUserService, forgotPasswordService, resetPasswordService, logoutUserService, getUserProfileService, updateProfileService, getUsersByIds } from "../service/user-service.js";
async function userRegister(req, res) {
    try {
        const result = await registerUserService(req.body);
        return res.status(201).json(result);
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
async function verifyOtp(req, res) {
    try {
        const { email, otp } = req.body;
        const result = await verifyOtpService(email, otp);
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
async function userLogin(req, res) {
    try {
        const result = await loginUserService(req.body);
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
async function forgotPassword(req, res) {
    try {
        await forgotPasswordService(req.body.email);
        return res.status(200).json({ message: "If that email is registered, a password reset link has been sent." });
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
async function resetPassword(req, res) {
    try {
        const { token, newPassword } = req.body;
        await resetPasswordService(token, newPassword);
        return res.status(200).json({ message: "Password reset successful. Please login with your new password." });
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
async function userLogout(req, res) {
    try {
        const refreshToken = req.refreshToken || req.cookies?.refreshToken;
        const authHeader = req.headers["authorization"];
        const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
        await logoutUserService(refreshToken, accessToken);
        res.clearCookie("refreshToken");
        return res.status(200).json({ message: "Logged out successfully" });
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
async function getUserProfile(req, res) {
    try {
        const user = await getUserProfileService(req.user.id);
        return res.status(200).json({ user });
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
async function userUpdate(req, res) {
    try {
        const { name } = req.body;
        const user = await updateProfileService(req.user.id, name);
        return res.status(200).json({ message: "Profile updated successfully", user });
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
async function findUsersByIdsController(req, res) {
    try {
        const { userIds } = req.body;
        const users = await getUsersByIds(userIds);
        return res.status(200).json({ users });
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
export { userRegister, verifyOtp, userLogin, forgotPassword, resetPassword, userLogout, getUserProfile, userUpdate, findUsersByIdsController };
//# sourceMappingURL=user-controller.js.map