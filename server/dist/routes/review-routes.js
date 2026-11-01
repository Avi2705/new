import express, {} from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import { requireRole } from "../middleware/role-middleware.js";
import { validateRequest } from "../middleware/validation-middleware.js";
import { createReviewSchema } from "../schemas/comment-review-schema.js";
import { reviewController } from "../controller/review-controller.js";
const reviewRouter = express.Router();
function attachProductIdParam(req, _res, next) {
    if (!req.body.productId && req.params.productId) {
        req.body.productId = req.params.productId;
    }
    next();
}
reviewRouter.post("/add", authMiddleware, requireRole("user"), validateRequest(createReviewSchema), reviewController.addReviewController);
reviewRouter.post("/:productId", authMiddleware, requireRole("user"), attachProductIdParam, validateRequest(createReviewSchema), reviewController.addReviewController);
reviewRouter.get("/vendor-reviews", authMiddleware, requireRole("vendor"), reviewController.getVendorReviewsController);
reviewRouter.get("/:productId", reviewController.getProductReviewsController);
export default reviewRouter;
//# sourceMappingURL=review-routes.js.map