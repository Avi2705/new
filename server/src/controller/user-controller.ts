import type { Request, Response } from "express";
import {
    registerUserService,
    verifyOtpService,
    loginUserService,
    forgotPasswordService,
    resetPasswordService,
    logoutUserService,
    getUserProfileService,
    updateProfileService,
    getUsersByIds
} from "../service/user-service.js";

async function userRegister(req: Request, res: Response) {
    try {
        const result = await registerUserService(req.body);
        return res.status(201).json(result);
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

async function verifyOtp(req: Request, res: Response) {
    try {
        const { email, otp } = req.body;
        const result = await verifyOtpService(email, otp);
        return res.status(200).json(result);
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

async function userLogin(req: Request, res: Response) {
    try {
        const result = await loginUserService(req.body);
        return res.status(200).json(result);
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

async function forgotPassword(req: Request, res: Response) {
    try {
        await forgotPasswordService(req.body.email);
        return res.status(200).json({ message: "If that email is registered, a password reset link has been sent." });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

async function resetPassword(req: Request, res: Response) {
    try {
        const { token, newPassword } = req.body;
        await resetPasswordService(token, newPassword);
        return res.status(200).json({ message: "Password reset successful. Please login with your new password." });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

async function userLogout(req: Request, res: Response) {
    try {
        const refreshToken = (req as any).refreshToken || (req.headers["x-refresh-token"] as string);
        const authHeader = req.headers["authorization"];
        const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
        await logoutUserService(refreshToken, accessToken);
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

async function getUserProfile(req: Request, res: Response) {
    try {
        const user = await getUserProfileService(req.user!.id);
        return res.status(200).json({ user });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

async function userUpdate(req: Request, res: Response) {
    try {
        const { name } = req.body;
        const user = await updateProfileService(req.user!.id, name);
        return res.status(200).json({ message: "Profile updated successfully", user });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

async function findUsersByIdsController(req: Request, res: Response) {
    try {
        const { userIds } = req.body;
        const users = await getUsersByIds(userIds);
        return res.status(200).json({ users });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

export {
    userRegister,
    verifyOtp,
    userLogin,
    forgotPassword,
    resetPassword,
    userLogout,
    getUserProfile,
    userUpdate,
    findUsersByIdsController
};
