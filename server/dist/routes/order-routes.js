import express, {} from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import { requireRole } from "../middleware/role-middleware.js";
import { validateRequest } from "../middleware/validation-middleware.js";
import { createOrderSchema } from "../schemas/order-schema.js";
import { orderController } from "../controller/order-controller.js";
const orderRouter = express.Router();
orderRouter.post("/place", authMiddleware, requireRole("user"), validateRequest(createOrderSchema), orderController.placeOrderController);
orderRouter.get("/my-orders", authMiddleware, requireRole("user"), orderController.getUserOrdersController);
orderRouter.get("/vendor-orders", authMiddleware, requireRole("vendor"), orderController.getVendorOrdersController);
orderRouter.get("/:orderId", authMiddleware, orderController.getSingleOrderController);
export default orderRouter;
//# sourceMappingURL=order-routes.js.map