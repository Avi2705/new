import { ObjectId } from "mongodb";
import { getDatabase } from "../config/db.js";
function db() {
    return getDatabase();
}
export async function insertOffer(offerDoc) {
    return await db().collection("offers").insertOne(offerDoc);
}
export async function findOfferByCode(offerCode) {
    const safeCode = offerCode.trim().toUpperCase();
    return await db().collection("offers").findOne({
        offerCode: safeCode,
        isActive: true,
        validUntil: { $gt: new Date() }
    });
}
export async function findOffersByVendorId(vendorId) {
    const _vendorId = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    return await db().collection("offers").find({ vendorId: _vendorId }).sort({ createdAt: -1 }).toArray();
}
export async function deactivateOffer(offerId, vendorId) {
    const _offerId = typeof offerId === "string" ? new ObjectId(offerId) : offerId;
    const _vendorId = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    return await db().collection("offers").updateOne({ _id: _offerId, vendorId: _vendorId }, { $set: { isActive: false, updatedAt: new Date() } });
}
//# sourceMappingURL=offer-dal.js.map