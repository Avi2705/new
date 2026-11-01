import { ObjectId } from "mongodb";
import { insertOrder, findOrdersByUserId, findOrdersByVendorId, findOrderById, updateOrderDocStatus } from "../dal/order-dal.js";
import { findProductById } from "../dal/product-dal.js";
import { findActivePrice } from "../dal/price-dal.js";
import ApiHandler from "../utils/error-handler.js";
import type { OrderDoc, OrderItem, PlaceOrderInput } from "../model/order.model.js";

export async function placeOrder(userId: string | ObjectId, data: PlaceOrderInput) {
    const _userId = typeof userId === "string" ? new ObjectId(userId) : userId;

    if (data.productId) {
        if (!ObjectId.isValid(data.productId)) throw new ApiHandler(400, "Invalid product ID");
        const _productId = new ObjectId(data.productId);
        const product = await findProductById(_productId);
        if (!product || product.isDeleted) throw new ApiHandler(404, "Product not found");

        const activePrice = await findActivePrice(_productId);
        const price = activePrice ? activePrice.price : (product.currentPrice || 0);
        const quantity = data.quantity || 1;
        const totalAmount = price * quantity;

        const orderDoc: OrderDoc = {
            userId: _userId,
            productId: _productId,
            productName: product.productName,
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
        const orderItems: OrderItem[] = [];
        let primaryVendorId: ObjectId | undefined;

        for (const item of data.items) {
            const _productId = new ObjectId(item.productId);
            const product = await findProductById(_productId);
            if (!product || product.isDeleted) throw new ApiHandler(404, `Product ${item.productId} not found`);

            const activePrice = await findActivePrice(_productId);
            const price = activePrice ? activePrice.price : (product.currentPrice || 0);
            const subtotal = price * item.quantity;
            totalAmount += subtotal;

            if (!primaryVendorId && product.vendorId) {
                primaryVendorId = product.vendorId;
            }

            orderItems.push({
                productId: _productId,
                productName: product.productName,
                vendorId: product.vendorId,
                quantity: item.quantity,
                price,
                subtotal
            });
        }

        const orderDoc: OrderDoc = {
            userId: _userId,
            ...(primaryVendorId ? { vendorId: primaryVendorId } : {}),
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

export async function getUserOrders(userId: string | ObjectId) {
    return await findOrdersByUserId(userId);
}

export async function getVendorOrders(vendorId: string | ObjectId) {
    return await findOrdersByVendorId(vendorId);
}

export async function getSingleOrder(orderId: string | ObjectId) {
    if (!ObjectId.isValid(String(orderId))) throw new ApiHandler(400, "Invalid order ID");
    const order = await findOrderById(orderId);
    if (!order) throw new ApiHandler(404, "Order not found");
    return order;
}

export async function updateOrderStatus(vendorId: string | ObjectId, orderId: string | ObjectId, status: string) {
    if (!ObjectId.isValid(String(orderId))) throw new ApiHandler(400, "Invalid order ID");
    const validStatuses = ["placed", "processing", "shipped", "delivered", "cancelled"];
    const targetStatus = status.toLowerCase();
    if (!validStatuses.includes(targetStatus)) {
        throw new ApiHandler(400, `Status must be one of: ${validStatuses.join(", ")}`);
    }

    const _orderId = new ObjectId(String(orderId));
    const _vendorId = new ObjectId(String(vendorId));

    const order = await findOrderById(_orderId);
    if (!order) throw new ApiHandler(404, "Order not found");

    const isAuthorized =
        (order.vendorId && order.vendorId.toString() === _vendorId.toString()) ||
        (order.items && order.items.some(i => i.vendorId && i.vendorId.toString() === _vendorId.toString()));

    if (!isAuthorized) throw new ApiHandler(403, "Not authorized to update this order");

    await updateOrderDocStatus(_orderId, targetStatus);
    return { ...order, status: targetStatus, updatedAt: new Date() };
}
