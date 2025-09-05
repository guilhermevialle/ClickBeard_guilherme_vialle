import { DOMAIN_ERROR, DomainError } from "./domain.error";

export class InvalidInputError extends DomainError {
  constructor(message?: string) {
    super({
      message: message ?? DOMAIN_ERROR.INVALID_INPUT.message,
      errorCode: DOMAIN_ERROR.INVALID_INPUT.errorCode,
    });
  }
}

export class AppointmentAlreadyCompletedError extends DomainError {
  constructor(message?: string) {
    super({
      message: message ?? DOMAIN_ERROR.APPOINTMENT_ALREADY_COMPLETED.message,
      errorCode: DOMAIN_ERROR.APPOINTMENT_ALREADY_COMPLETED.errorCode,
    });
  }
}

export class AppointmentAlreadyCancelledError extends DomainError {
  constructor(message?: string) {
    super({
      message: message ?? DOMAIN_ERROR.APPOINTMENT_ALREADY_CANCELLED.message,
      errorCode: DOMAIN_ERROR.APPOINTMENT_ALREADY_CANCELLED.errorCode,
    });
  }
}

export class CannotCancelAppointmentError extends DomainError {
  constructor(message?: string) {
    super({
      message: message ?? DOMAIN_ERROR.CANNOT_CANCEL_APPOINTMENT.message,
      errorCode: DOMAIN_ERROR.CANNOT_CANCEL_APPOINTMENT.errorCode,
    });
  }
}
