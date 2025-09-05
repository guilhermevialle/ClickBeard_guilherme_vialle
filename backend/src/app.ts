import cors from "@fastify/cors";
import "dotenv/config";
import "reflect-metadata";
import "./container";
import { adminRoutes } from "./infra/http/routes/admin.route";
import { appointmentRoutes } from "./infra/http/routes/appointment.route";
import { authRoutes } from "./infra/http/routes/auth.route";
import { barberSpecialtyRoutes } from "./infra/http/routes/barber-specialty.route";
import { barberRoutes } from "./infra/http/routes/barber.route";
import { specialtyRoutes } from "./infra/http/routes/specialty.route";

import fastify from "fastify";
import { registerErrorHandlerPlugin } from "./plugins/register-error-handler-plugin";

export const app = fastify({
  logger: true,
});

async function setupApp() {
  await app.register(cors, {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  });

  await app.register(import("@fastify/swagger"), {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "Barber Shop API",
        description: "API documentation for Barber Shop application",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:8080",
          description: "Development server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });

  await app.register(import("@fastify/swagger-ui"), {
    routePrefix: "/documentation",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    staticCSP: true,
  });

  await app.register(async function (fastify) {
    barberRoutes(fastify);
    authRoutes(fastify);
    specialtyRoutes(fastify);
    barberSpecialtyRoutes(fastify);
    appointmentRoutes(fastify);
    adminRoutes(fastify);
  });

  await registerErrorHandlerPlugin(app);
}

setupApp().catch(console.error);
