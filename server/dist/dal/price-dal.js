import { ObjectId } from "mongodb";
import { getDatabase } from "../config/db.js";
function db() {
    return getDatabase();
}
export async function insertPrice(priceDoc) {
    return await db().collection("productPrices").insertOne(priceDoc);
}
export async function deactivateActivePrices(productId) {
    const _id = typeof productId === "string" ? new ObjectId(productId) : productId;
    return await db().collection("productPrices").updateMany({ productId: _id, isActive: true }, { $set: { isActive: false, updatedAt: new Date() } });
}
export async function findActivePrice(productId) {
    const _id = typeof productId === "string" ? new ObjectId(productId) : productId;
    return await db().collection("productPrices").findOne({ productId: _id, isActive: true });
}
//# sourceMappingURL=price-dal.js.map