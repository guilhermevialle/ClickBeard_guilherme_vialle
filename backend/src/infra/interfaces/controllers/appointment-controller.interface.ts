import { FastifyReply, FastifyRequest } from "fastify";

export interface IAppointmentController {
  cancel: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  create(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  getAllByCustomerId(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void>;
}
