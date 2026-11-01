import type { ObjectId } from "mongodb";

export interface ReviewDoc {
    _id?: ObjectId;
    productId: ObjectId;
    productName?: string;
    vendorId?: ObjectId;
    userId: ObjectId;
    userName?: string;
    rating: number;
    comment: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateReviewInput {
    productId: string;
    comment: string;
    rating?: number;
}
