import { ObjectId } from "mongodb";
import type { CreateReviewInput, ReviewDoc } from "../model/review.model.js";
export declare function addReview(userId: string | ObjectId, { productId, comment, rating }: CreateReviewInput): Promise<{
    productId: ObjectId;
    productName?: string;
    vendorId?: ObjectId;
    userId: ObjectId;
    userName?: string;
    rating: number;
    comment: string;
    createdAt?: Date;
    updatedAt?: Date;
    _id: ObjectId;
}>;
export declare function getProductReviews(productId: string | ObjectId): Promise<{
    totalReviews: number;
    averageRating: number;
    reviews: import("mongodb").WithId<ReviewDoc>[];
}>;
export declare function getVendorReviews(vendorId: string | ObjectId): Promise<import("mongodb").WithId<ReviewDoc>[]>;
//# sourceMappingURL=review-service.d.ts.map