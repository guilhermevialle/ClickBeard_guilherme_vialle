import {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { ApplicationError } from "../application/errors/application.error";
import { BadRequestError } from "../application/errors/shared";
import { DomainError } from "../domain/errors/domain.error";
import { InvalidInputError } from "../domain/errors/shared";

export async function registerErrorHandlerPlugin(app: FastifyInstance) {
  app.setErrorHandler(
    (error: FastifyError, _: FastifyRequest, reply: FastifyReply) => {
      if (error instanceof DomainError)
        return reply.status(400).send(error.toJSON());

      if (error instanceof ApplicationError)
        return reply.status(error.statusCode).send(error.toJSON());

      if (error instanceof BadRequestError)
        return reply.status(400).send(error.toJSON());

      if (error instanceof InvalidInputError)
        return reply.status(400).send(error.toJSON());

      return reply.status(500).send({
        message: "Internal Server Error",
        errorCode: "INTERNAL_SERVER_ERROR",
        statusCode: 500,
      });
    }
  );
}
