import type { Request, Response } from "express";
import {
    registerVendorService,
    verifyVendorOtpService,
    loginVendorService,
    forgotPasswordVendorService,
    resetPasswordVendorService,
    logoutVendorService,
    getVendorProfileService,
    updateVendorProfileService
} from "../service/vendor-service.js";

async function vendorRegister(req: Request, res: Response) {
    try {
        const result = await registerVendorService(req.body);
        return res.status(201).json(result);
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

async function verifyVendorOtp(req: Request, res: Response) {
    try {
        const { email, otp } = req.body;
        const result = await verifyVendorOtpService(email, otp);
        return res.status(200).json(result);
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

async function vendorLogin(req: Request, res: Response) {
    try {
        const result = await loginVendorService(req.body);
        return res.status(200).json(result);
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

async function forgotVendorPassword(req: Request, res: Response) {
    try {
        await forgotPasswordVendorService(req.body.email);
        return res.status(200).json({ message: "If that email is registered, a password reset link has been sent." });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

async function resetVendorPassword(req: Request, res: Response) {
    try {
        const { token, newPassword } = req.body;
        await resetPasswordVendorService(token, newPassword);
        return res.status(200).json({ message: "Password reset successful. Please login with your new password." });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

async function vendorLogout(req: Request, res: Response) {
    try {
        const refreshToken = (req as any).refreshToken || (req.headers["x-refresh-token"] as string);
        const authHeader = req.headers["authorization"];
        const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
        await logoutVendorService(refreshToken, accessToken);
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

async function getVendorProfile(req: Request, res: Response) {
    try {
        const vendor = await getVendorProfileService(req.user!.id);
        return res.status(200).json({ vendor });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

async function vendorUpdate(req: Request, res: Response) {
    try {
        const { name } = req.body;
        const vendor = await updateVendorProfileService(req.user!.id, name);
        return res.status(200).json({ message: "Profile updated successfully", vendor });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

export {
    vendorRegister,
    verifyVendorOtp,
    vendorLogin,
    forgotVendorPassword,
    resetVendorPassword,
    vendorLogout,
    getVendorProfile,
    vendorUpdate
};
