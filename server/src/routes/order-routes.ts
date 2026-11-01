import express, { type Router } from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import { requireRole } from "../middleware/role-middleware.js";
import { validateRequest } from "../middleware/validation-middleware.js";
import { createOrderSchema, updateOrderStatusSchema } from "../schemas/order-schema.js";
import { orderController } from "../controller/order-controller.js";

const orderRouter: Router = express.Router();

orderRouter.post("/place", authMiddleware, requireRole("user"), validateRequest(createOrderSchema), orderController.placeOrderController);
orderRouter.get("/my-orders", authMiddleware, requireRole("user"), orderController.getUserOrdersController);
orderRouter.get("/vendor-orders", authMiddleware, requireRole("vendor"), orderController.getVendorOrdersController);
orderRouter.patch("/:orderId/status", authMiddleware, requireRole("vendor"), validateRequest(updateOrderStatusSchema), orderController.updateOrderStatusController);
orderRouter.get("/:orderId", authMiddleware, orderController.getSingleOrderController);

export default orderRouter;
