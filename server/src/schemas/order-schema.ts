import Joi from "joi";

export const createOrderSchema = Joi.object({
    productId: Joi.string().hex().length(24).optional(),
    quantity: Joi.number().integer().min(1).optional(),
    items: Joi.array().items(
        Joi.object({
            productId: Joi.string().hex().length(24).required(),
            quantity: Joi.number().integer().min(1).required()
        })
    ).optional()
}).or("productId", "items");

export const updateOrderStatusSchema = Joi.object({
    status: Joi.string().valid("placed", "processing", "shipped", "delivered", "cancelled").required()
});

export default createOrderSchema;
