import express, { type Router } from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import { requireRole } from "../middleware/role-middleware.js";
import { validateRequest } from "../middleware/validation-middleware.js";
import { addToCartSchema } from "../schemas/cart-schema.js";
import { cartController } from "../controller/cart-controller.js";

const cartRouter: Router = express.Router();

cartRouter.post("/add", authMiddleware, requireRole("user"), validateRequest(addToCartSchema), cartController.addToCartController);
cartRouter.get("/", authMiddleware, requireRole("user"), cartController.getCartController);
cartRouter.delete("/clear", authMiddleware, requireRole("user"), cartController.clearCartController);

export default cartRouter;
