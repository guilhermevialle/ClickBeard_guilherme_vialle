import { FastifyReply, FastifyRequest } from "fastify";

export interface IBarberController {
  createBarber: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  getAll: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  getAllForBff: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
}
