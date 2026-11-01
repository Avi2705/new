import Joi from "joi";

export const vendorSchema = Joi.object({
    name: Joi.string().trim().required().min(5),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});

export default vendorSchema;
