import joi from "joi";

export const createContactSchema = joi.object({
    body: joi.object({
        name: joi.string().required(),
        phone: joi.string().required(),
    }).required()
});

export const updateContactSchema = joi.object({
    body: joi.object({
        name: joi.string(),
        phone: joi.string(),
    }).required().min(1)
});