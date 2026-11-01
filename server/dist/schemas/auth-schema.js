import Joi from "joi";
export const registerSchema = Joi.object({
    name: Joi.string().trim().min(5).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(8).required()
});
export const loginSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().required()
});
export const forgotPasswordSchema = Joi.object({
    email: Joi.string().trim().email().required()
});
export const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(8).required()
});
//# sourceMappingURL=auth-schema.js.map