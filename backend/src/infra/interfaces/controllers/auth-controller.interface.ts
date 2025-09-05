import { FastifyReply, FastifyRequest } from "fastify";

export interface IAuthController {
  authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  register(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  refreshSession(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}
