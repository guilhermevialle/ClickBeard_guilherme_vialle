import { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { IAuthService } from "../../interfaces/auth-service.interface";
import { AuthController } from "../controllers/auth.controller";

export function authRoutes(fastify: FastifyInstance) {
  const authService = container.resolve<IAuthService>("AuthService");

  const authController = new AuthController(authService);

  fastify.post("/auth/login", authController.authenticate.bind(authController));
  fastify.post("/auth/register", authController.register.bind(authController));
}
