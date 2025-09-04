import { APPLICATION_ERROR } from "./application-error-map";
import { ApplicationError } from "./application.error";

export class UserAlreadyExistsError extends ApplicationError {
  constructor(message?: string) {
    super({
      message: message ?? APPLICATION_ERROR.USER_ALREADY_EXISTS.message,
      errorCode: APPLICATION_ERROR.USER_ALREADY_EXISTS.errorCode,
      statusCode: APPLICATION_ERROR.USER_ALREADY_EXISTS.statusCode,
    });
  }
}

export class BarberAlreadyExistsError extends ApplicationError {
  constructor(message?: string) {
    super({
      message: message ?? APPLICATION_ERROR.BARBER_ALREADY_EXISTS.message,
      errorCode: APPLICATION_ERROR.BARBER_ALREADY_EXISTS.errorCode,
      statusCode: APPLICATION_ERROR.BARBER_ALREADY_EXISTS.statusCode,
    });
  }
}

export class CustomerNotFoundError extends ApplicationError {
  constructor(message?: string) {
    super({
      message: message ?? APPLICATION_ERROR.CUSTOMER_NOT_FOUND.message,
      errorCode: APPLICATION_ERROR.CUSTOMER_NOT_FOUND.errorCode,
      statusCode: APPLICATION_ERROR.CUSTOMER_NOT_FOUND.statusCode,
    });
  }
}

export class InvalidCredentialsError extends ApplicationError {
  constructor(message?: string) {
    super({
      message: message ?? APPLICATION_ERROR.INVALID_CREDENTIALS.message,
      errorCode: APPLICATION_ERROR.INVALID_CREDENTIALS.errorCode,
      statusCode: APPLICATION_ERROR.INVALID_CREDENTIALS.statusCode,
    });
  }
}

export class BadRequestError extends ApplicationError {
  constructor(message?: string) {
    super({
      message: message ?? APPLICATION_ERROR.BAD_REQUEST.message,
      errorCode: APPLICATION_ERROR.BAD_REQUEST.errorCode,
      statusCode: APPLICATION_ERROR.BAD_REQUEST.statusCode,
    });
  }
}

export class SpecialtyAlreadyExistsError extends ApplicationError {
  constructor(message?: string) {
    super({
      message: message ?? APPLICATION_ERROR.SPECIALTY_ALREADY_EXISTS.message,
      errorCode: APPLICATION_ERROR.SPECIALTY_ALREADY_EXISTS.errorCode,
      statusCode: APPLICATION_ERROR.SPECIALTY_ALREADY_EXISTS.statusCode,
    });
  }
}
