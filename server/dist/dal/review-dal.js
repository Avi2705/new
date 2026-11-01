import { ObjectId } from "mongodb";
import { getDatabase } from "../config/db.js";
function db() {
    return getDatabase();
}
export async function insertReview(reviewDoc) {
    return await db().collection("reviews").insertOne(reviewDoc);
}
export async function findReviewsByProductId(productId) {
    const _productId = typeof productId === "string" ? new ObjectId(productId) : productId;
    return await db().collection("reviews").find({ productId: _productId }).sort({ createdAt: -1 }).toArray();
}
export async function findReviewsByVendorId(vendorId) {
    const _vendorId = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    return await db().collection("reviews").find({ vendorId: _vendorId }).sort({ createdAt: -1 }).toArray();
}
export async function findReviewById(reviewId) {
    const _id = typeof reviewId === "string" ? new ObjectId(reviewId) : reviewId;
    return await db().collection("reviews").findOne({ _id });
}
//# sourceMappingURL=review-dal.js.map