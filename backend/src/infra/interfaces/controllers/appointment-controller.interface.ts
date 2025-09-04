import { FastifyReply, FastifyRequest } from "fastify";

export interface IAppointmentController {
  create(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}
