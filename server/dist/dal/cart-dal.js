import { ObjectId } from "mongodb";
import { getDatabase } from "../config/db.js";
function db() {
    return getDatabase();
}
export async function findCartByUserId(userId) {
    const _userId = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection("carts").findOne({ userId: _userId });
}
export async function createCart(userId, items = []) {
    const _userId = typeof userId === "string" ? new ObjectId(userId) : userId;
    const doc = {
        userId: _userId,
        items,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    return await db().collection("carts").insertOne(doc);
}
export async function updateCart(userId, items) {
    const _userId = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection("carts").updateOne({ userId: _userId }, { $set: { items, updatedAt: new Date() } });
}
export async function clearCart(userId) {
    const _userId = typeof userId === "string" ? new ObjectId(userId) : userId;
    return await db().collection("carts").updateOne({ userId: _userId }, { $set: { items: [], updatedAt: new Date() } });
}
//# sourceMappingURL=cart-dal.js.map