import type { ObjectId } from "mongodb";

export interface OfferDoc {
    _id?: ObjectId;
    vendorId: ObjectId;
    offerCode: string;
    discountPercent: number;
    validUntil: Date;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateOfferInput {
    offerCode: string;
    discountPercent: number;
    validUntil: string | Date;
}
