import express, { type Router } from "express";
import { validateRequest } from "../middleware/validation-middleware.js";
import authMiddleware from "../middleware/auth-middleware.js";
import { requireRole } from "../middleware/role-middleware.js";
import { productPriceSchema, activatePriceSchema } from "../schemas/price-schema.js";
import { priceController } from "../controller/price-controller.js";

const priceRouter: Router = express.Router();

priceRouter.post("/set-price", authMiddleware, requireRole("vendor"), validateRequest(productPriceSchema), priceController.setProductPrice);
priceRouter.get("/all/:productId", authMiddleware, requireRole("vendor"), priceController.getAllProductPricesController);
priceRouter.patch("/:priceId/activate", authMiddleware, requireRole("vendor"), validateRequest(activatePriceSchema), priceController.activatePriceController);
priceRouter.get("/:productId", priceController.getProductPrice);

export default priceRouter;
