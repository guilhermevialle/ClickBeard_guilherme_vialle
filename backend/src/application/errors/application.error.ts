export interface ApplicationErrorProps {
  message: string;
  errorCode: string;
  statusCode: number;
}

export class ApplicationError extends Error {
  constructor(public readonly props: ApplicationErrorProps) {
    super(props.message);
    this.name = this.constructor.name;
  }

  public toJSON() {
    return {
      message: this.message,
      errorCode: this.errorCode,
      statusCode: this.statusCode,
    };
  }

  // getters
  get message() {
    return this.props.message;
  }
  get errorCode() {
    return this.props.errorCode;
  }
  get statusCode() {
    return this.props.statusCode;
  }
}
