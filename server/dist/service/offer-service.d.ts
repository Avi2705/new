import { ObjectId } from "mongodb";
import type { CreateOfferInput, OfferDoc } from "../model/offer.model.js";
export declare function createOffer(vendorId: string | ObjectId, data: CreateOfferInput): Promise<{
    vendorId: ObjectId;
    offerCode: string;
    discountPercent: number;
    validUntil: Date;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    _id: ObjectId;
}>;
export declare function validateOffer(offerCode: string): Promise<import("mongodb").WithId<OfferDoc>>;
export declare function getVendorOffers(vendorId: string | ObjectId): Promise<import("mongodb").WithId<OfferDoc>[]>;
export declare function removeOffer(vendorId: string | ObjectId, offerId: string | ObjectId): Promise<{
    message: string;
}>;
//# sourceMappingURL=offer-service.d.ts.map