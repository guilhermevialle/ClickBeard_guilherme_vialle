interface DomainErrorProps {
  message?: string;
  errorCode: string;
  statusCode: number;
}

export const DOMAIN_ERROR = {
  BAD_REQUEST: {
    message: "Bad request",
    errorCode: "BAD_REQUEST",
    statusCode: 400,
  },
} as const;

export class DomainError extends Error {
  constructor(public readonly props: DomainErrorProps) {
    super(props.message);
    this.name = this.constructor.name;
  }
}
