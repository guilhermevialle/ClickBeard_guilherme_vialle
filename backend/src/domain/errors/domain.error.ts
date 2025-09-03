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
}
