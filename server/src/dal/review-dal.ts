import { ObjectId, type WithId } from "mongodb";
import { getDatabase } from "../config/db.js";
import type { ReviewDoc } from "../model/review.model.js";

function db() {
    return getDatabase();
}

export async function insertReview(reviewDoc: ReviewDoc) {
    return await db().collection<ReviewDoc>("reviews").insertOne(reviewDoc);
}

export async function findReviewsByProductId(productId: string | ObjectId): Promise<WithId<ReviewDoc>[]> {
    const _productId = typeof productId === "string" ? new ObjectId(productId) : productId;
    return await db().collection<ReviewDoc>("reviews").find({ productId: _productId }).sort({ createdAt: -1 }).toArray() as WithId<ReviewDoc>[];
}

export async function findReviewsByVendorId(vendorId: string | ObjectId): Promise<WithId<ReviewDoc>[]> {
    const _vendorId = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    return await db().collection<ReviewDoc>("reviews").find({ vendorId: _vendorId }).sort({ createdAt: -1 }).toArray() as WithId<ReviewDoc>[];
}

export async function findReviewById(reviewId: string | ObjectId): Promise<WithId<ReviewDoc> | null> {
    const _id = typeof reviewId === "string" ? new ObjectId(reviewId) : reviewId;
    return await db().collection<ReviewDoc>("reviews").findOne({ _id }) as WithId<ReviewDoc> | null;
}
