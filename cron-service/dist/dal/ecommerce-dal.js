import { ObjectId } from "mongodb";
import { getEcommerceDb } from "../config/db.js";
function db() {
    return getEcommerceDb();
}
export async function findVendorProducts(vendorId) {
    const _vendorId = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    return await db().collection("products").find({
        vendorId: _vendorId,
        isDeleted: { $ne: true }
    }).toArray();
}
export async function findActivePriceByProductId(productId) {
    const _productId = typeof productId === "string" ? new ObjectId(productId) : productId;
    const priceDoc = await db().collection("productPrices").findOne({
        productId: _productId,
        isActive: true
    });
    if (priceDoc)
        return priceDoc;
    return await db().collection("prices").findOne({
        productId: _productId,
        isActive: true
    });
}
export async function findReviewsByProductId(productId) {
    const _productId = typeof productId === "string" ? new ObjectId(productId) : productId;
    return await db().collection("reviews").find({
        productId: _productId
    }).sort({ createdAt: -1 }).toArray();
}
export async function findOrdersByProductId(productId) {
    const _productId = typeof productId === "string" ? new ObjectId(productId) : productId;
    return await db().collection("orders").find({
        productId: _productId
    }).toArray();
}
export async function findUsersByIds(userIds) {
    if (!userIds || userIds.length === 0) {
        return [];
    }
    const validObjectIds = userIds
        .filter(id => id && ObjectId.isValid(id))
        .map(id => typeof id === "string" ? new ObjectId(id) : id);
    if (validObjectIds.length === 0) {
        return [];
    }
    return await db().collection("users").find({
        _id: { $in: validObjectIds }
    }).project({ password: 0, sessions: 0, otpHash: 0, resetPasswordTokenHash: 0 }).toArray();
}
export async function updateVendorLatestExport(vendorId, exportDetails) {
    const _vendorId = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    return await db().collection("vendor").updateOne({ _id: _vendorId }, {
        $set: {
            latestExport: {
                jobId: exportDetails.jobId,
                zipPath: exportDetails.zipPath,
                status: exportDetails.status,
                totalProducts: exportDetails.totalProducts,
                finishedAt: exportDetails.finishedAt,
                updatedAt: new Date()
            }
        }
    });
}
export async function findVendorById(vendorId) {
    const _vendorId = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    return await db().collection("vendor").findOne({ _id: _vendorId });
}
//# sourceMappingURL=ecommerce-dal.js.map