import { FastifyRequest } from "fastify";

export interface ReqWithUserId extends FastifyRequest {
  userId: string;
}
