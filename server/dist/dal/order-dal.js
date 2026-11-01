import { ObjectId } from "mongodb";
import { getDatabase } from "../config/db.js";
function db() {
    return getDatabase();
}
export async function insertOrder(orderDoc) {
    return await db().collection("orders").insertOne(orderDoc);
}
export async function findOrdersByUserId(userId) {
    const _userId = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection("orders").find({ userId: _userId }).sort({ createdAt: -1 }).toArray();
}
export async function findOrdersByVendorId(vendorId) {
    const _vendorId = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    return await db().collection("orders").find({ vendorId: _vendorId }).sort({ createdAt: -1 }).toArray();
}
export async function findOrderById(orderId) {
    const _id = typeof orderId === "string" ? new ObjectId(orderId) : orderId;
    return await db().collection("orders").findOne({ _id });
}
//# sourceMappingURL=order-dal.js.map