import { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import { BadRequestError } from "../../../application/errors/shared";
import {
  CreateBarberWithSpecialties,
  createBarberWithSpecialtiesSchemaDto,
} from "../../../application/use-cases/create-barber-with-specialties";
import { IBarberController } from "../../interfaces/controllers/barber-controller.interface";

@injectable()
export class BarberController implements IBarberController {
  constructor(
    @inject("CreateBarberWithSpecialties")
    private readonly createBarberWithSpecialties: CreateBarberWithSpecialties
  ) {}

  async createBarber(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const body = request.body;
    const result = createBarberWithSpecialtiesSchemaDto.safeParse(body);

    if (!result.success) throw new BadRequestError(result.error.message);

    const { age, hiredAt, name, specialtyIds } = result.data;

    const barber = await this.createBarberWithSpecialties.execute({
      age,
      hiredAt,
      name,
      specialtyIds,
    });

    return reply.status(201).send(barber.toJSON());
  }
}
