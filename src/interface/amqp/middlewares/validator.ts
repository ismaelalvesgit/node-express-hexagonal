import { curryN } from "ramda";
import { AnySchema } from "joi";
import { InvalidProperties } from "@util/error";
import { AmqpParsedMessage, AmqpMessage } from "@type/interface";

/**
 * Applies the validation of the desired message schema
 * @param schema Joi schema
 * @param msg Parsed message to validate the schema
 */
export const validator = curryN(
  2,
  <T>(schema: AnySchema, msg: AmqpParsedMessage<T>): AmqpMessage => {
    const validation = schema.validate(msg, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: true,
    });

    if (validation.error) {
      throw new InvalidProperties(
        "message properties",
        validation.error?.details,
      );
    }

    return msg;
  },
);
