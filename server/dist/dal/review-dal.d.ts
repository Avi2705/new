import { ObjectId, type WithId } from "mongodb";
import type { ReviewDoc } from "../model/review.model.js";
export declare function insertReview(reviewDoc: ReviewDoc): Promise<import("mongodb").InsertOneResult<ReviewDoc>>;
export declare function findReviewsByProductId(productId: string | ObjectId): Promise<WithId<ReviewDoc>[]>;
export declare function findReviewsByVendorId(vendorId: string | ObjectId): Promise<WithId<ReviewDoc>[]>;
export declare function findReviewById(reviewId: string | ObjectId): Promise<WithId<ReviewDoc> | null>;
//# sourceMappingURL=review-dal.d.ts.map