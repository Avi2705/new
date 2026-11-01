import { ObjectId } from "mongodb";
import { insertReview, findReviewsByProductId, findReviewsByVendorId } from "../dal/review-dal.js";
import { findProductById } from "../dal/product-dal.js";
import ApiHandler from "../utils/error-handler.js";
import { getDatabase } from "../config/db.js";
import type { CreateReviewInput, ReviewDoc } from "../model/review.model.js";

export async function addReview(userId: string | ObjectId, { productId, comment, rating = 5 }: CreateReviewInput) {
    if (!productId || !/^[0-9a-fA-F]{24}$/.test(productId)) {
        throw new ApiHandler(400, "Invalid product ID");
    }

    const _productId = new ObjectId(productId);
    const _userId = typeof userId === "string" ? new ObjectId(userId) : userId;

    const product = await findProductById(_productId);
    if (!product) {
        throw new ApiHandler(404, "Product not found");
    }

    const user: any = await getDatabase().collection("users").findOne({ _id: _userId });

    const reviewDoc: ReviewDoc = {
        productId: _productId,
        productName: product.productName,
        vendorId: product.vendorId,
        userId: _userId,
        userName: user?.name || "Anonymous",
        rating: Number(rating),
        comment: String(comment).trim(),
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const result = await insertReview(reviewDoc);
    return { _id: result.insertedId, ...reviewDoc };
}

export async function getProductReviews(productId: string | ObjectId) {
    if (!productId || !/^[0-9a-fA-F]{24}$/.test(String(productId))) {
        throw new ApiHandler(400, "Invalid product ID");
    }

    const reviews = await findReviewsByProductId(productId);
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
        : 0;

    return {
        totalReviews,
        averageRating,
        reviews
    };
}

export async function getVendorReviews(vendorId: string | ObjectId) {
    const _vendorId = typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId;
    const reviews = await findReviewsByVendorId(_vendorId);
    return reviews;
}
