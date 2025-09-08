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

// desabilita TODA validação de schema - Swagger sera apenas para documentacao
app.setValidatorCompiler(() => {
  return () => true; // sempre retorna true = nunca valida
});

// desabilita tambem a serialização baseada em schema
app.setSerializerCompiler(() => {
  return (data) => JSON.stringify(data);
});

async function setupApp() {
  await app.register(cors, {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  });

  // @ts-expect-error swagger configurado APENAS para documentacao
  await app.register(import("@fastify/swagger"), {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "ClickBeard API",
        description:
          "API documentation for ClickBeard(Documentation only - Validation handled by Zod)",
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
    // configuracao para desabilitar validação de schema
    transform: ({ schema, url, method, httpStatus }: any) => {
      // remove schemas de validacao mas mantem documentacao
      const transformedSchema = { ...schema };
      delete transformedSchema.body;
      delete transformedSchema.querystring;
      delete transformedSchema.params;
      delete transformedSchema.headers;
      return { schema: transformedSchema, url, method, httpStatus };
    },
    validatorCompiler: () => () => true,
    serializerCompiler: () => (data: unknown) => JSON.stringify(data),
  });

  await app.register(import("@fastify/swagger-ui"), {
    routePrefix: "/documentation",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
      displayRequestDuration: true,
      tryItOutEnabled: true,
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
