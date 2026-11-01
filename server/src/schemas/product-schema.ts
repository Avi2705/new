import Joi from "joi";

export const createProductSchema = Joi.object({
    productName: Joi.string().max(50).required(),
    productDescription: Joi.string().max(100).required(),
    productCategory: Joi.string().required(),
    productImages: Joi.array().items(Joi.string()).default([]),
    productVideos: Joi.array().items(Joi.string()).default([])
}).unknown(true);

export default createProductSchema;
