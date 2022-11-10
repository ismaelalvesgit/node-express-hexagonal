import R from "ramda";
import { StatusCodes } from "http-status-codes";
import { Logger } from "@util/logger";
import {
  OutOfCuttingTime,
  InternalServer,
  BadRequest,
  NotFound,
  InvalidProperties,
  AlreadyExists,
  FailedSQL,
  ServiceUnavailable,
} from "@util/error";
import { HttpRequest, HttpResponse, HttpNext } from "@type/interface";
import { getAgent } from "@util/apm";

const errorsConfigs = [
  { class: NotFound, type: null, value: "NotFoundError" },
  { class: FailedSQL, type: "ER_DUP_ENTRY", value: "BadRequest.Duplicate" },
  { class: FailedSQL, type: "ERROR", value: "InternalServer" },
  { class: ServiceUnavailable, type: "router", value: "ServiceUnavailable.router" },
  { class: ServiceUnavailable, type: "throttling", value: "ServiceUnavailable.throttling" },
  { class: InvalidProperties, type: "any.required", value: "InvalidProperties.required" },
  { class: InvalidProperties, type: "any.only", value: "InvalidProperties.only" },
  { class: InvalidProperties, type: "string.empty", value: "InvalidProperties.empty" },
  { class: InvalidProperties, type: "string.min", value: "InvalidProperties.min" },
  { class: InvalidProperties, type: "string.email", value: "InvalidProperties.email" },
  { class: InvalidProperties, type: "async.exist", value: "InvalidProperties.async" },
];

const _getErrorConfig = error => errorsConfigs.find((errorConfig) => {
  if (error instanceof NotFound && error instanceof errorConfig.class) {
    return errorConfig;
  }
  if (error instanceof errorConfig.class && error.i18n === errorConfig.type) {
    return errorConfig;
  }
  return false;
});

const _loadErrorMessage = (req: HttpRequest, err: any) =>{
  const requestId = req.requestId;
  if (err instanceof InvalidProperties) {
    err.details = err.details?.map((detail: any)=>{
      err.i18n = detail?.type;
      const errorConfig = _getErrorConfig(err);
      if(errorConfig){
        detail.message = req.__(errorConfig.value, {
          name: detail.context.key,
          limit: detail.context.limit,
          value: detail.context.value,
          valids: detail.context.valids,
          code: detail?.type
        });
      }
      return detail;
    });
  } else {
    const message = `Invalid request ${requestId}`;
    const details = [{message: ""}];
    switch (err.constructor) {
      case ServiceUnavailable: {
        err.message = message;
        err.details = details;
        break;
      }
      default: {
        if(err.code === "ER_DUP_ENTRY"){
          const i18n = err.code;
          const details = [{message: err.sqlMessage.split(/'(.*?)'/)[1]}];
          err = new FailedSQL(message, details, i18n);
        }
        if(err.sqlMessage){
          err = new FailedSQL(message, details, "ERROR");
        }
        break;
      }
    }

    const errorConfig = _getErrorConfig(err);
    if (errorConfig) {
      err.details = err.details?.map((detail: any)=>{
        detail.message = req.__(errorConfig.value, {
          code: err.code,
          name: detail.message,
          requestId
        });
        return detail;
      });
    }
  }
  return err;
};

/* eslint-disable no-unused-vars*/
export const errorHandler = (
  err: any,
  req: HttpRequest,
  res: HttpResponse,
  next: HttpNext,
  ) => {
  Logger.warn(`requestId: ${req.requestId}, error: ${err}`);
  let status = StatusCodes.INTERNAL_SERVER_ERROR;
  let throwErr = _loadErrorMessage(req, err);
  switch (throwErr.constructor) {
    case BadRequest:
    case FailedSQL:
    case InvalidProperties: {
      status = StatusCodes.BAD_REQUEST;
      break;
    }
    case NotFound: {
      status = StatusCodes.NOT_FOUND;
      break;
    }
    case OutOfCuttingTime: {
      status = StatusCodes.BAD_GATEWAY;
      break;
    }
    case ServiceUnavailable: {
      status = StatusCodes.TOO_MANY_REQUESTS;

      if(throwErr.i18n === "router"){
        status = StatusCodes.NOT_IMPLEMENTED;
      }
    
      break;
    }
    case AlreadyExists: {
      status = StatusCodes.CONFLICT;
      break;
    }
    default: {
      throwErr = new InternalServer(throwErr.message, throwErr.details);
      if (getAgent() && getAgent().isStarted()) {
        getAgent().captureError(err);
      }
    }
  }

  return res.status(status).json(
    R.reject(R.isNil, {
      code: throwErr.code,
      message: throwErr.message,
      details: throwErr.details,
    }),
  );
};
