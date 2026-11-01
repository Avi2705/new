import Joi from "joi";
export const addToCartSchema = Joi.object({
    productId: Joi.string().hex().length(24).required(),
    quantity: Joi.number().integer().min(1).default(1)
});
export default addToCartSchema;
//# sourceMappingURL=cart-schema.js.map