export const APPLICATION_ERROR = {
  USER_ALREADY_EXISTS: {
    message: "User already exists",
    errorCode: "USER_ALREADY_EXISTS",
    statusCode: 409,
  },
  CUSTOMER_NOT_FOUND: {
    message: "User not found",
    errorCode: "USER_NOT_FOUND",
    statusCode: 404,
  },
  INVALID_CREDENTIALS: {
    message: "Invalid credentials",
    errorCode: "INVALID_CREDENTIALS",
    statusCode: 401,
  },
  BAD_REQUEST: {
    message: "Bad request",
    errorCode: "BAD_REQUEST",
    statusCode: 400,
  },
} as const;
