import { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import { BadRequestError } from "../../../application/errors/shared";
import { IAuthController } from "../../interfaces/controllers/auth-controller.interface";
import type { IAuthService } from "../../interfaces/services/auth-service.interface";
import { authLoginSchemaDto, authRegisterSchemaDto } from "./dtos/auth.dto";

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject("AuthService") private readonly authService: IAuthService
  ) {}

  async authenticate(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body;
    const result = authLoginSchemaDto.safeParse(body);

    if (!result.success) throw new BadRequestError(result.error.message);

    const { email, password } = result.data;

    const session = await this.authService.authenticateCustomer({
      email,
      password,
    });

    return reply.status(200).send(session);
  }

  async register(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body;
    const result = authRegisterSchemaDto.safeParse(body);

    if (!result.success) throw new BadRequestError(result.error.message);

    const { name, email, password } = result.data;

    const session = await this.authService.registerCustomer({
      name,
      email,
      password,
    });

    return reply.status(200).send(session);
  }
}
