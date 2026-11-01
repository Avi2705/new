import Joi from "joi";
export const productPriceSchema = Joi.object({
    productId: Joi.string().hex().required(),
    price: Joi.number().positive().precision(2).required(),
    isActive: Joi.boolean().default(false)
});
export default productPriceSchema;
//# sourceMappingURL=price-schema.js.map