import { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { IAuthService } from "../../interfaces/services/auth-service.interface";
import { AuthController } from "../controllers/auth.controller";

const registerSwaggerSchema = {
  description: "Register customer",
  tags: ["auth"],
  body: {
    type: "object",
    required: ["email", "password", "name"],
    properties: {
      name: { type: "string" },
      email: { type: "string" },
      password: { type: "string" },
    },
  },
  response: {
    400: {
      description: "User already exists",
      type: "object",
      properties: {
        message: { type: "string", example: "User already exists." },
        errorCode: { type: "string", example: "USER_ALREADY_EXISTS" },
        statusCode: { type: "integer", example: 400 },
      },
    },
    201: {
      description: "Customer registered successfully!",
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            id: { type: "string", example: "123" },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "kTt7H@example.com" },
          },
        },
        session: {
          type: "object",
          properties: {
            accessToken: { type: "string", example: "accessToken" },
            refreshToken: { type: "string", example: "refreshToken" },
          },
        },
      },
    },
  },
};

const authenticateSwaggerSchema = {
  description: "Authenticate customer",
  tags: ["auth"],
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string" },
      password: { type: "string" },
    },
  },
  response: {
    401: {
      description: "Invalid credentials",
      type: "object",
      properties: {
        message: { type: "string", example: "Invalid email or password." },
        errorCode: { type: "string", example: "INVALID_CREDENTIALS" },
        statusCode: { type: "number", example: 401 },
      },
    },
    200: {
      description: "Customer registered successfully!",
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            id: { type: "string", example: "123" },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "kTt7H@example.com" },
          },
        },
        session: {
          type: "object",
          properties: {
            accessToken: { type: "string", example: "accessToken" },
            refreshToken: { type: "string", example: "refreshToken" },
          },
        },
      },
    },
  },
};

const refreshTokenSwaggerSchema = {
  description: "Refresh session",
  tags: ["auth"],
  body: {
    type: "object",
    required: ["refreshToken"],
    properties: {
      refreshToken: { type: "string" },
    },
  },
  response: {
    401: {
      description: "Invalid refresh token",
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Invalid or expired refresh token.",
        },
        errorCode: { type: "string", example: "INVALID_CREDENTIALS" },
        statusCode: { type: "number", example: 401 },
      },
    },
    200: {
      description: "Session refreshed successfully!",
      type: "object",
      properties: {
        accessToken: { type: "string", example: "accessToken" },
        refreshToken: { type: "string", example: "refreshToken" },
      },
    },
  },
};

export function authRoutes(app: FastifyInstance) {
  const authService = container.resolve<IAuthService>("AuthService");
  const authController = new AuthController(authService);

  app.post(
    "/auth/login",
    { schema: authenticateSwaggerSchema },
    authController.authenticate.bind(authController)
  );
  app.post(
    "/auth/register",
    { schema: registerSwaggerSchema },
    authController.register.bind(authController)
  );
  app.post(
    "/auth/refresh",
    { schema: refreshTokenSwaggerSchema },
    authController.refreshSession.bind(authController)
  );
}
