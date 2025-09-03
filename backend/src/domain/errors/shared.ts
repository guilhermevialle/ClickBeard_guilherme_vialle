import { DOMAIN_ERROR, DomainError } from "./domain.error";

export class BadRequestError extends DomainError {
  constructor(message?: string) {
    super({
      message: message ?? DOMAIN_ERROR.BAD_REQUEST.message,
      errorCode: DOMAIN_ERROR.BAD_REQUEST.errorCode,
      statusCode: DOMAIN_ERROR.BAD_REQUEST.statusCode,
    });
  }
}
