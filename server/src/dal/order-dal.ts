import { ObjectId, type WithId } from "mongodb";
import { getDatabase } from "../config/db.js";
import type { OrderDoc } from "../model/order.model.js";

function db() {
    return getDatabase();
}

export async function insertOrder(orderDoc: OrderDoc) {
    return await db().collection<OrderDoc>("orders").insertOne(orderDoc);
}

export async function findOrdersByUserId(userId: string | ObjectId): Promise<WithId<OrderDoc>[]> {
    const _userId = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection<OrderDoc>("orders").find({ userId: _userId }).sort({ createdAt: -1 }).toArray() as WithId<OrderDoc>[];
}

export async function findOrdersByVendorId(vendorId: string | ObjectId): Promise<WithId<OrderDoc>[]> {
    const _vendorId = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    return await db().collection<OrderDoc>("orders").find({
        $or: [
            { vendorId: _vendorId },
            { "items.vendorId": _vendorId }
        ]
    }).sort({ createdAt: -1 }).toArray() as WithId<OrderDoc>[];
}

export async function findOrderById(orderId: string | ObjectId): Promise<WithId<OrderDoc> | null> {
    const _id = typeof orderId === "string" ? new ObjectId(orderId) : orderId;
    return await db().collection<OrderDoc>("orders").findOne({ _id }) as WithId<OrderDoc> | null;
}

export async function updateOrderDocStatus(orderId: string | ObjectId, status: string) {
    const _id = typeof orderId === "string" ? new ObjectId(orderId) : orderId;
    return await db().collection<OrderDoc>("orders").updateOne(
        { _id },
        { $set: { status, updatedAt: new Date() } }
    );
}
