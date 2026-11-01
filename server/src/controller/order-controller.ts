import type { Request, Response } from "express";
import { placeOrder, getUserOrders, getVendorOrders, getSingleOrder, updateOrderStatus } from "../service/order-service.js";

export async function placeOrderController(req: Request, res: Response) {
    try {
        const userId = req.user!.id;
        const order = await placeOrder(userId, req.body);
        return res.status(201).json({ message: "Order placed successfully", order });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

export async function getUserOrdersController(req: Request, res: Response) {
    try {
        const userId = req.user!.id;
        const orders = await getUserOrders(userId);
        return res.status(200).json({ count: orders.length, orders });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

export async function getVendorOrdersController(req: Request, res: Response) {
    try {
        const vendorId = req.user!.id;
        const orders = await getVendorOrders(vendorId);
        return res.status(200).json({ count: orders.length, orders });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

export async function getSingleOrderController(req: Request, res: Response) {
    try {
        const { orderId } = req.params;
        const targetOrderId = Array.isArray(orderId) ? orderId[0] : orderId;
        const order = await getSingleOrder(targetOrderId!);
        return res.status(200).json({ order });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

export async function updateOrderStatusController(req: Request, res: Response) {
    try {
        const vendorId = req.user!.id;
        const { orderId } = req.params;
        const { status } = req.body;
        const targetOrderId = Array.isArray(orderId) ? orderId[0] : orderId;
        const order = await updateOrderStatus(vendorId, targetOrderId!, status);
        return res.status(200).json({ message: "Order status updated successfully", order });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

export const orderController = {
    placeOrderController,
    getUserOrdersController,
    getVendorOrdersController,
    getSingleOrderController,
    updateOrderStatusController
};

export default orderController;
