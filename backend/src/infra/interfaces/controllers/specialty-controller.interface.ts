import { FastifyReply, FastifyRequest } from "fastify";

export interface ISpecialtyController {
  create(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  getAll(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}
