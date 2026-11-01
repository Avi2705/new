import express, { type Router } from "express";
import userSchema from "../schemas/user-schema.js";
import {
    userRegister,
    verifyOtp,
    userLogin,
    forgotPassword,
    resetPassword,
    userLogout,
    getUserProfile,
    userUpdate
} from "../controller/user-controller.js";
import { validateRequest } from "../middleware/validation-middleware.js";
import { forgotPasswordSchema, resetPasswordSchema } from "../schemas/auth-schema.js";
import authMiddleware from "../middleware/auth-middleware.js";
import { otpRateLimit } from "../utils/otp-limiter.js";

const userRouter: Router = express.Router();

userRouter.post("/register", validateRequest(userSchema), otpRateLimit, userRegister);

userRouter.post("/verify-otp", verifyOtp);

userRouter.post("/login", userLogin);

userRouter.post("/forgot-password", validateRequest(forgotPasswordSchema), forgotPassword);

userRouter.post("/reset-password", validateRequest(resetPasswordSchema), resetPassword);

userRouter.post("/logout", authMiddleware, userLogout);

userRouter.get("/profile", authMiddleware, getUserProfile);
userRouter.get("/me", authMiddleware, getUserProfile);

userRouter.patch("/update", authMiddleware, userUpdate);

export default userRouter;
