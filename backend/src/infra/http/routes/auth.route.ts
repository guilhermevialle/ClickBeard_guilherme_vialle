import { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { IAuthService } from "../../interfaces/services/auth-service.interface";
import { AuthController } from "../controllers/auth.controller";

export function authRoutes(app: FastifyInstance) {
  const authService = container.resolve<IAuthService>("AuthService");
  const authController = new AuthController(authService);

  app.post("/auth/login", authController.authenticate.bind(authController));
  app.post("/auth/register", authController.register.bind(authController));
  app.post("/auth/refresh", authController.refreshSession.bind(authController));
}
