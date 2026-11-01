import { ObjectId } from "mongodb";
import { insertOrder, findOrdersByUserId, findOrdersByVendorId, findOrderById } from "../dal/order-dal.js";
import { findProductById } from "../dal/product-dal.js";
import { findActivePrice } from "../dal/price-dal.js";
import ApiHandler from "../utils/error-handler.js";
export async function placeOrder(userId, data) {
    const _userId = typeof userId === "string" ? new ObjectId(userId) : userId;
    if (data.productId) {
        if (!ObjectId.isValid(data.productId))
            throw new ApiHandler(400, "Invalid product ID");
        const _productId = new ObjectId(data.productId);
        const product = await findProductById(_productId);
        if (!product || product.isDeleted)
            throw new ApiHandler(404, "Product not found");
        const activePrice = await findActivePrice(_productId);
        const price = activePrice ? activePrice.price : (product.currentPrice || 0);
        const quantity = data.quantity || 1;
        const totalAmount = price * quantity;
        const orderDoc = {
            userId: _userId,
            productId: _productId,
            vendorId: product.vendorId,
            quantity,
            totalAmount,
            status: "placed",
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const result = await insertOrder(orderDoc);
        return { _id: result.insertedId, ...orderDoc };
    }
    if (data.items && Array.isArray(data.items) && data.items.length > 0) {
        let totalAmount = 0;
        const orderItems = [];
        for (const item of data.items) {
            const _productId = new ObjectId(item.productId);
            const product = await findProductById(_productId);
            if (!product || product.isDeleted)
                throw new ApiHandler(404, `Product ${item.productId} not found`);
            const activePrice = await findActivePrice(_productId);
            const price = activePrice ? activePrice.price : (product.currentPrice || 0);
            const subtotal = price * item.quantity;
            totalAmount += subtotal;
            orderItems.push({
                productId: _productId,
                quantity: item.quantity,
                price,
                subtotal
            });
        }
        const orderDoc = {
            userId: _userId,
            items: orderItems,
            totalAmount,
            status: "placed",
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const result = await insertOrder(orderDoc);
        return { _id: result.insertedId, ...orderDoc };
    }
    throw new ApiHandler(400, "Either productId or items array must be provided");
}
export async function getUserOrders(userId) {
    return await findOrdersByUserId(userId);
}
export async function getVendorOrders(vendorId) {
    return await findOrdersByVendorId(vendorId);
}
export async function getSingleOrder(orderId) {
    if (!ObjectId.isValid(String(orderId)))
        throw new ApiHandler(400, "Invalid order ID");
    const order = await findOrderById(orderId);
    if (!order)
        throw new ApiHandler(404, "Order not found");
    return order;
}
//# sourceMappingURL=order-service.js.map