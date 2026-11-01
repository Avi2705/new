import express, { type Router } from "express";
import vendorSchema from "../schemas/vendor-schema.js";
import {
    vendorRegister,
    verifyVendorOtp,
    vendorLogin,
    forgotVendorPassword,
    resetVendorPassword,
    vendorLogout,
    getVendorProfile,
    vendorUpdate
} from "../controller/vendor-controller.js";
import { validateRequest } from "../middleware/validation-middleware.js";
import { forgotPasswordSchema, resetPasswordSchema } from "../schemas/auth-schema.js";
import authMiddleware from "../middleware/auth-middleware.js";
import { otpRateLimit } from "../utils/otp-limiter.js";
import { requireRole } from "../middleware/role-middleware.js";

const vendorRouter: Router = express.Router();

vendorRouter.post("/register", validateRequest(vendorSchema), otpRateLimit, vendorRegister);

vendorRouter.post("/verify-otp", verifyVendorOtp);

vendorRouter.post("/login", vendorLogin);

vendorRouter.post("/forgot-password", validateRequest(forgotPasswordSchema), forgotVendorPassword);

vendorRouter.post("/reset-password", validateRequest(resetPasswordSchema), resetVendorPassword);

vendorRouter.post("/logout", authMiddleware, requireRole("vendor"), vendorLogout);

vendorRouter.get("/profile", authMiddleware, requireRole("vendor"), getVendorProfile);
vendorRouter.get("/me", authMiddleware, requireRole("vendor"), getVendorProfile);

vendorRouter.patch("/update", authMiddleware, requireRole("vendor"), vendorUpdate);

export default vendorRouter;
