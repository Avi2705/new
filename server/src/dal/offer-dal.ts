import { ObjectId, type WithId } from "mongodb";
import { getDatabase } from "../config/db.js";
import type { OfferDoc } from "../model/offer.model.js";

function db() {
    return getDatabase();
}

export async function insertOffer(offerDoc: OfferDoc) {
    return await db().collection<OfferDoc>("offers").insertOne(offerDoc);
}

export async function findOfferByCode(offerCode: string): Promise<WithId<OfferDoc> | null> {
    const safeCode = offerCode.trim().toUpperCase();
    return await db().collection<OfferDoc>("offers").findOne({
        offerCode: safeCode,
        isActive: true,
        validUntil: { $gt: new Date() }
    }) as WithId<OfferDoc> | null;
}

export async function findOffersByVendorId(vendorId: string | ObjectId): Promise<WithId<OfferDoc>[]> {
    const _vendorId = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    return await db().collection<OfferDoc>("offers").find({ vendorId: _vendorId }).sort({ createdAt: -1 }).toArray() as WithId<OfferDoc>[];
}

export async function deactivateOffer(offerId: string | ObjectId, vendorId: string | ObjectId) {
    const _offerId = typeof offerId === "string" ? new ObjectId(offerId) : offerId;
    const _vendorId = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    return await db().collection<OfferDoc>("offers").updateOne(
        { _id: _offerId, vendorId: _vendorId },
        { $set: { isActive: false, updatedAt: new Date() } }
    );
}
