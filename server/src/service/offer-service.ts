import { ObjectId } from "mongodb";
import { insertOffer, findOfferByCode, findOffersByVendorId, deactivateOffer } from "../dal/offer-dal.js";
import ApiHandler from "../utils/error-handler.js";
import type { CreateOfferInput, OfferDoc } from "../model/offer.model.js";

export async function createOffer(vendorId: string | ObjectId, data: CreateOfferInput) {
    if (!vendorId || !ObjectId.isValid(String(vendorId))) {
        throw new ApiHandler(400, "Invalid vendor ID");
    }

    const _vendorId = new ObjectId(String(vendorId));
    const code = data.offerCode.trim().toUpperCase();

    const existing = await findOfferByCode(code);
    if (existing) {
        throw new ApiHandler(400, "An active offer with this code already exists");
    }

    const offerDoc: OfferDoc = {
        vendorId: _vendorId,
        offerCode: code,
        discountPercent: Number(data.discountPercent),
        validUntil: new Date(data.validUntil),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const result = await insertOffer(offerDoc);
    return { _id: result.insertedId, ...offerDoc };
}

export async function validateOffer(offerCode: string) {
    if (!offerCode) throw new ApiHandler(400, "Offer code is required");
    const offer = await findOfferByCode(offerCode);
    if (!offer) throw new ApiHandler(404, "Invalid or expired offer code");
    return offer;
}

export async function getVendorOffers(vendorId: string | ObjectId) {
    return await findOffersByVendorId(vendorId);
}

export async function removeOffer(vendorId: string | ObjectId, offerId: string | ObjectId) {
    if (!ObjectId.isValid(String(offerId))) throw new ApiHandler(400, "Invalid offer ID");
    const result = await deactivateOffer(offerId, vendorId);
    if (result.matchedCount === 0) throw new ApiHandler(404, "Offer not found or unauthorized");
    return { message: "Offer deactivated successfully" };
}
