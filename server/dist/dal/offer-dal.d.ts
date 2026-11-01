import { ObjectId, type WithId } from "mongodb";
import type { OfferDoc } from "../model/offer.model.js";
export declare function insertOffer(offerDoc: OfferDoc): Promise<import("mongodb").InsertOneResult<OfferDoc>>;
export declare function findOfferByCode(offerCode: string): Promise<WithId<OfferDoc> | null>;
export declare function findOffersByVendorId(vendorId: string | ObjectId): Promise<WithId<OfferDoc>[]>;
export declare function deactivateOffer(offerId: string | ObjectId, vendorId: string | ObjectId): Promise<import("mongodb").UpdateResult<OfferDoc>>;
//# sourceMappingURL=offer-dal.d.ts.map