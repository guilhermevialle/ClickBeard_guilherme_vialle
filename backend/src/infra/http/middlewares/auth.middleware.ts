import { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import type { ITokenService } from "../../services/jwt-token.service";

@injectable()
export class AuthMiddleware {
  constructor(
    @inject("AccessTokenService") private readonly jwtService: ITokenService
  ) {}

  public handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const header = request.headers.authorization;

    if (!header)
      return reply.status(401).send({
        message: "Authorization header missing",
        statusCode: 401,
        errorCode: "AUTHORIZATION_HEADER_MISSING",
      });

    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return reply.status(401).send({
        message: "Malformed token",
        statusCode: 401,
        errorCode: "MALFORMED_TOKEN",
      });
    }

    const decoded = this.jwtService.verify<{ userId: string }>(token);
    if (!decoded?.userId) {
      return reply.status(401).send({
        message: "Invalid or expired token",
        statusCode: 401,
        errorCode: "INVALID_OR_EXPIRED_TOKEN",
      });
    }

    (request as any).userId = decoded.userId;
  };
}
