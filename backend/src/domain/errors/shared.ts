import { DOMAIN_ERROR, DomainError } from "./domain.error";

export class InvalidInputError extends DomainError {
  constructor(message?: string) {
    super({
      message: message ?? DOMAIN_ERROR.invalidInput.message,
      errorCode: DOMAIN_ERROR.invalidInput.errorCode,
    });
  }
}
