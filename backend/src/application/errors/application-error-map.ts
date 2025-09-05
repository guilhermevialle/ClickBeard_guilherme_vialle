export const APPLICATION_ERROR = {
  APPOINTMENT_NOT_FOUND: {
    message: "Appointment not found",
    errorCode: "APPOINTMENT_NOT_FOUND",
    statusCode: 404,
  },
  BARBER_NOT_AVAILABLE: {
    message: "Barber not available",
    errorCode: "BARBER_NOT_AVAILABLE",
    statusCode: 409,
  },
  PENDING_APPOINTMENT: {
    message: "There is a pending appointment",
    errorCode: "PENDING_APPOINTMENT",
    statusCode: 409,
  },
  BARBER_NOT_FOUND: {
    message: "Barber not found",
    errorCode: "BARBER_NOT_FOUND",
    statusCode: 404,
  },
  BARBER_ALREADY_EXISTS: {
    message: "Barber already exists",
    errorCode: "BARBER_ALREADY_EXISTS",
    statusCode: 409,
  },
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
  SPECIALTY_ALREADY_EXISTS: {
    message: "Specialty already exists",
    errorCode: "SPECIALTY_ALREADY_EXISTS",
    statusCode: 409,
  },
} as const;
