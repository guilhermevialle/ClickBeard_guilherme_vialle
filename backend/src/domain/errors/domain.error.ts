export const DOMAIN_ERROR = {
  invalidInput: {
    message: "Invalid input data",
    errorCode: "INVALID_INPUT",
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
