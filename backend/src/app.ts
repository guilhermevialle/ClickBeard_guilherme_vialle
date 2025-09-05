import cors from "@fastify/cors";
import "dotenv/config";
import "reflect-metadata";
import { ApplicationError } from "./application/errors/application.error";
import { BadRequestError } from "./application/errors/shared";
import "./container";
import { DomainError } from "./domain/errors/domain.error";
import { InvalidInputError } from "./domain/errors/shared";
import { adminRoutes } from "./infra/http/routes/admin.route";
import { appointmentRoutes } from "./infra/http/routes/appointment.route";
import { authRoutes } from "./infra/http/routes/auth.route";
import { barberSpecialtyRoutes } from "./infra/http/routes/barber-specialty.route";
import { barberRoutes } from "./infra/http/routes/barber.route";
import { specialtyRoutes } from "./infra/http/routes/specialty.route";

import fastify = require("fastify");

export const app = fastify();

app.register(cors, {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
});

app.register(import("@fastify/swagger"));
app.register(import("@fastify/swagger-ui"), {
  routePrefix: "/documentation",
  uiConfig: { docExpansion: "full", deepLinking: false },
  staticCSP: true,
});

// error handler
app.setErrorHandler(
  (
    error: fastify.FastifyError,
    _: fastify.FastifyRequest,
    reply: fastify.FastifyReply
  ) => {
    if (error instanceof DomainError) {
      return reply.status(400).send(error.toJSON());
    }

    if (error instanceof ApplicationError) {
      return reply.status(error.statusCode).send(error.toJSON());
    }

    if (error instanceof BadRequestError) {
      return reply.status(400).send(error.toJSON());
    }

    if (error instanceof InvalidInputError) {
      return reply.status(400).send(error.toJSON());
    }

    return reply.status(500).send({
      message: "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
    });
  }
);

// rotas
barberRoutes(app);
authRoutes(app);
specialtyRoutes(app);
barberSpecialtyRoutes(app);
appointmentRoutes(app);
adminRoutes(app);
