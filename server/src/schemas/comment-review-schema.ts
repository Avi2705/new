import Joi from "joi";

export const createReviewSchema = Joi.object({
    productId: Joi.string().hex().length(24).required(),
    comment: Joi.string().trim().min(1).max(500).required(),
    rating: Joi.number().integer().min(0).max(5).default(5)
});

export const commentReviewSchema = createReviewSchema;
export default createReviewSchema;
