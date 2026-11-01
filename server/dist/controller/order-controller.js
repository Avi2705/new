import { placeOrder, getUserOrders, getVendorOrders, getSingleOrder } from "../service/order-service.js";
export async function placeOrderController(req, res) {
    try {
        const userId = req.user.id;
        const order = await placeOrder(userId, req.body);
        return res.status(201).json({ message: "Order placed successfully", order });
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
export async function getUserOrdersController(req, res) {
    try {
        const userId = req.user.id;
        const orders = await getUserOrders(userId);
        return res.status(200).json({ count: orders.length, orders });
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
export async function getVendorOrdersController(req, res) {
    try {
        const vendorId = req.user.id;
        const orders = await getVendorOrders(vendorId);
        return res.status(200).json({ count: orders.length, orders });
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
export async function getSingleOrderController(req, res) {
    try {
        const { orderId } = req.params;
        const targetOrderId = Array.isArray(orderId) ? orderId[0] : orderId;
        const order = await getSingleOrder(targetOrderId);
        return res.status(200).json({ order });
    }
    catch (err) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}
export const orderController = {
    placeOrderController,
    getUserOrdersController,
    getVendorOrdersController,
    getSingleOrderController
};
export default orderController;
//# sourceMappingURL=order-controller.js.map