import { ValidationParams } from "@type/interface";
import { InvalidProperties } from "./error";

export default ({ errorMsg, params, schema }: ValidationParams)=>{
    const validation = schema.validate(params, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: false,
    });

    if (validation.error) {
        throw new InvalidProperties(errorMsg, validation.error.details);
    }
};