import Joi from "joi";
export const createOfferSchema = Joi.object({
    offerCode: Joi.string().trim().uppercase().min(3).max(20).required(),
    discountPercent: Joi.number().min(1).max(99).required(),
    validUntil: Joi.date().greater("now").required()
});
export default createOfferSchema;
//# sourceMappingURL=offer-schema.js.map