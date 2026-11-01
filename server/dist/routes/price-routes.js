import express, {} from "express";
import { validateRequest } from "../middleware/validation-middleware.js";
import authMiddleware from "../middleware/auth-middleware.js";
import { requireRole } from "../middleware/role-middleware.js";
import { productPriceSchema } from "../schemas/price-schema.js";
import { priceController } from "../controller/price-controller.js";
const priceRouter = express.Router();
priceRouter.post("/set-price", authMiddleware, requireRole("vendor"), validateRequest(productPriceSchema), priceController.setProductPrice);
priceRouter.get("/:productId", priceController.getProductPrice);
export default priceRouter;
//# sourceMappingURL=price-routes.js.map