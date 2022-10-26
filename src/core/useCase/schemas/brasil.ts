import joi from "joi";

export const cepSchema = joi.object({
    cep: joi.number().required(),
});