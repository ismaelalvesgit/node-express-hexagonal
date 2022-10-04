/* eslint-disable max-classes-per-file */
class CustomError extends Error {
  private code: string;
  private details: CustomError[] | null;

  constructor(
    code: string,
    message: string | null = null,
    details: CustomError[] | null = null,
  ) {
    super(message || code);
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidProperties extends CustomError {
  constructor(message: string, details: unknown) {
    super("INVALID_PROPERTIES", message, details as CustomError[]);
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string, details: null | any[] = null) {
    super("INTERNAL_SERVER_ERROR", message, details);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string, details: null | any[] = null) {
    super("BAD_REQUEST", message, details);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string, details: null | any[] = null) {
    super("NOT_FOUND_ERROR", message, details);
  }
}

export class FailedSQL extends CustomError {
  constructor(msg: string) {
    super("FAILED_SQL", msg);
  }
}

export class AlreadyExists extends CustomError {
  constructor(msg: string) {
    super("ALREADY_EXISTS", msg);
  }
}

export class OutOfCuttingTimeError extends CustomError {
  constructor(msg: string) {
    super("OUT_OF_CUTTING_TIME", msg);
  }
}