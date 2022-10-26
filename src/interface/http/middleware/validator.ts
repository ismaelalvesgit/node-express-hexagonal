import { AnySchema } from "joi";
import { curryN } from "ramda";
import { Logger } from "@util/logger";
import { InvalidProperties } from "@util/error";
import { HttpRequest, HttpResponse, HttpNext } from "@type/interface";

export const validator = curryN(
  4,
  (schema: AnySchema, req: HttpRequest, res: HttpResponse, next: HttpNext) => {
    const validation = schema.validate(req, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: true,
    });
    const requestId = req.requestId;
    if (validation.error) {
      Logger.debug(
        {
          class: "Validator",
          classType: "HttpMiddleware",
          details: validation.error.details,
        },
        `invalid request params request ${requestId}`,
      );

      return next(
        new InvalidProperties(`Invalid request params request ${requestId}`, validation.error.details),
      );
    }

    Object.assign(req, validation.value);

    return next();
  },
);
