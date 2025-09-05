export const DOMAIN_ERROR = {
  INVALID_INPUT: {
    message: "Invalid input data",
    errorCode: "INVALID_INPUT",
  },
  APPOINTMENT_ALREADY_COMPLETED: {
    message: "Appointment already completed",
    errorCode: "APPOINTMENT_ALREADY_COMPLETED",
  },
  APPOINTMENT_ALREADY_CANCELLED: {
    message: "Appointment already cancelled",
    errorCode: "APPOINTMENT_ALREADY_CANCELLED",
  },
  CANNOT_CANCEL_APPOINTMENT: {
    message: "Cannot cancel appointment.",
    errorCode: "CANNOT_CANCEL_APPOINTMENT",
  },
};

interface DomainErrorProps {
  message: string;
  errorCode: string;
}

export class DomainError extends Error {
  constructor(public readonly props: DomainErrorProps) {
    super(props.message);
    this.name = this.constructor.name;
  }

  public toJSON() {
    return {
      message: this.message,
      errorCode: this.errorCode,
    };
  }

  // getters
  get message() {
    return this.props.message;
  }
  get errorCode() {
    return this.props.errorCode;
  }
}
