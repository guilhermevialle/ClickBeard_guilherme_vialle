import { FastifyReply, FastifyRequest } from "fastify";

export interface IBarberSpecialtyController {
  getAll(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}
