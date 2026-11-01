import type { Request, Response } from "express";
import { addReview, getProductReviews, getVendorReviews } from "../service/review-service.js";

export async function addReviewController(req: Request, res: Response) {
    try {
        const userId = req.user!.id;
        const { productId, comment, rating } = req.body;
        const review = await addReview(userId, { productId, comment, rating });
        return res.status(201).json({ message: "Review added successfully", review });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

export async function getProductReviewsController(req: Request, res: Response) {
    try {
        const { productId } = req.params;
        const targetId = Array.isArray(productId) ? productId[0] : productId;
        const data = await getProductReviews(targetId!);
        return res.status(200).json({ message: "Product reviews fetched", ...data });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

export async function getVendorReviewsController(req: Request, res: Response) {
    try {
        const vendorId = req.user!.id;
        const reviews = await getVendorReviews(vendorId);
        return res.status(200).json({ message: "Vendor reviews fetched", count: reviews.length, reviews });
    } catch (err: any) {
        return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
    }
}

export const reviewController = {
    addReviewController,
    getProductReviewsController,
    getVendorReviewsController
};

export default reviewController;
