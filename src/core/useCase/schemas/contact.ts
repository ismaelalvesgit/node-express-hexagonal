import joi from "joi";

export const createContactSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().required(),
});