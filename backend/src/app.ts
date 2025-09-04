import cors from "@fastify/cors";
import "dotenv/config";
import "reflect-metadata";
import { ApplicationError } from "./application/errors/application.error";
import "./container";
import { DomainError } from "./domain/errors/domain.error";
import { authRoutes } from "./infra/http/routes/auth";

import fastify = require("fastify");

export const app = fastify();

app.register(cors, {
  origin: "http://localhost:5173",
  credentials: true,
});

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

    console.error(error);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
);

authRoutes(app);
